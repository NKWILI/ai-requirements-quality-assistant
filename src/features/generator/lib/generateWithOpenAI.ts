import type { UserStory } from "../generator.types";
import { buildUserStory } from "./simulateUserStory";

/**
 * Server-only bridge to the OpenAI Chat Completions API. This is the real
 * counterpart to {@link simulateUserStory}: it turns raw bullet points into a
 * German user story. The API key is read from the environment and never leaves
 * the server. If the call fails for any reason the caller can fall back to the
 * deterministic local simulator.
 */

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const DEFAULT_MODEL = "gpt-4o-mini";

function readApiKey(): string | undefined {
  // OPENAI_API_KEY is the canonical name; `API` is kept for backwards
  // compatibility with the original .env.
  return process.env.OPENAI_API_KEY ?? process.env.API;
}

/** True when a key is configured, so the caller can decide whether to try. */
export function hasOpenAIKey(): boolean {
  return Boolean(readApiKey());
}

const SYSTEM_PROMPT = [
  "Du bist ein Assistent für Anforderungsqualität in agilen Teams.",
  "Aus stichpunktartigen Notizen formulierst du genau EINE deutsche User Story",
  'im Format "Als <Rolle> möchte ich <Ziel>, damit <Nutzen>."',
  "Leite passende, testbare Akzeptanzkriterien ab.",
  "Antworte ausschließlich mit JSON nach dem vorgegebenen Schema, ohne Erklärtext.",
].join(" ");

function buildUserPrompt(input: string): string {
  return [
    "Notizen (Stichpunkte):",
    input.trim(),
    "",
    "Gib ein JSON-Objekt mit genau diesen Feldern zurück:",
    '{ "title": string (die vollständige User Story in einem Satz),',
    '  "role": string, "goal": string, "benefit": string,',
    '  "qualityScore": number (0-100, deine Einschätzung der Story-Qualität),',
    '  "acceptanceCriteria": string[] (2-5 testbare Kriterien) }',
  ].join("\n");
}

interface RawStory {
  title?: unknown;
  role?: unknown;
  goal?: unknown;
  benefit?: unknown;
  qualityScore?: unknown;
  acceptanceCriteria?: unknown;
}

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function clampScore(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 75;
  return Math.max(0, Math.min(100, Math.round(n)));
}

/** Coerce the model's JSON into a well-formed UserStory, filling gaps. */
function toUserStory(raw: RawStory, input: string): UserStory {
  // Reuse the deterministic builder for any fields the model omitted.
  const fallback = buildUserStory(input);
  const criteria = Array.isArray(raw.acceptanceCriteria)
    ? raw.acceptanceCriteria.map((c) => str(c)).filter(Boolean)
    : [];

  return {
    title: str(raw.title, fallback.title),
    role: str(raw.role, fallback.role),
    goal: str(raw.goal, fallback.goal),
    benefit: str(raw.benefit, fallback.benefit),
    qualityScore: raw.qualityScore === undefined ? fallback.qualityScore : clampScore(raw.qualityScore),
    acceptanceCriteria: criteria.length > 0 ? criteria : fallback.acceptanceCriteria,
  };
}

export interface GenerateOptions {
  /** Abort the request after this many ms (default 20s). */
  timeoutMs?: number;
}

/**
 * Generate a user story via OpenAI. Throws if no key is configured or the API
 * call fails, so the caller can fall back to the local simulator.
 */
export async function generateWithOpenAI(
  input: string,
  options: GenerateOptions = {},
): Promise<UserStory> {
  const apiKey = readApiKey();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 20_000);

  try {
    const res = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? DEFAULT_MODEL,
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(input) },
        ],
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`OpenAI request failed (${res.status}): ${detail.slice(0, 300)}`);
    }

    const data = await res.json();
    const content: string = data?.choices?.[0]?.message?.content ?? "";
    if (!content) {
      throw new Error("OpenAI returned an empty response.");
    }

    const raw = JSON.parse(content) as RawStory;
    return toUserStory(raw, input);
  } finally {
    clearTimeout(timeout);
  }
}
