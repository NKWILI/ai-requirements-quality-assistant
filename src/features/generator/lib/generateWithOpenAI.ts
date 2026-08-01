import type { UserStory } from "../generator.types";
import { buildUserStory } from "./simulateUserStory";
import { UnusableInputError, unusableMessage } from "./errors";

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
  'Der Satz MUSS die Konjunktion "damit" verwenden — niemals "um ... zu".',
  'Nach "damit" folgt ein vollständiger Nebensatz mit Subjekt und konjugiertem',
  "Verb am Satzende (z.B. \"damit ich Berichte schnell teilen kann\").",
  "Achte auf einwandfreie deutsche Grammatik und übernimm Stichpunkte nicht",
  "wortwörtlich, sondern formuliere sie grammatikalisch korrekt aus.",
  "Leite passende, testbare Akzeptanzkriterien ab.",
  "Wenn die Eingabe keine sinnvolle Anforderung erkennen lässt (z.B. zufällige",
  "Zeichen, Tastaturgeklimper, sinnlose Buchstabenfolgen, leerer Inhalt), dann",
  "setze usable=false und erfinde KEINE Story.",
  "Antworte ausschließlich mit JSON nach dem vorgegebenen Schema, ohne Erklärtext.",
].join(" ");

function buildUserPrompt(input: string): string {
  return [
    "Notizen (Stichpunkte):",
    input.trim(),
    "",
    "Gib ein JSON-Objekt mit genau diesen Feldern zurück:",
    '{ "usable": boolean (false, wenn kein sinnvoller Inhalt erkennbar ist),',
    '  "message": string (nur wenn usable=false: kurze deutsche Erklärung, was fehlt),',
    '  "title": string (die vollständige User Story in einem Satz, MUSS ", damit" enthalten),',
    '  "role": string, "goal": string,',
    '  "benefit": string (nur der Nebensatz nach "damit", ohne das Wort "damit",',
    '              mit Subjekt und Verb am Ende, z.B. "ich Berichte schnell teilen kann"),',
    '  "acceptanceCriteria": string[] (2-5 testbare Kriterien) }',
  ].join("\n");
}

interface RawStory {
  usable?: unknown;
  message?: unknown;
  title?: unknown;
  role?: unknown;
  goal?: unknown;
  benefit?: unknown;
  acceptanceCriteria?: unknown;
}

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

/**
 * Coerce the model's JSON into a well-formed UserStory, filling gaps.
 * Throws {@link UnusableInputError} when the model flagged the input as
 * meaningless. The quality score is intentionally left at 0 here — the route
 * derives it from the shared INVEST evaluation so the Generator and Evaluator
 * always agree.
 */
function toUserStory(raw: RawStory, input: string): UserStory {
  if (raw.usable === false) {
    throw new UnusableInputError(unusableMessage(str(raw.message)));
  }

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
    qualityScore: 0, // set by the caller via the INVEST evaluation
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
