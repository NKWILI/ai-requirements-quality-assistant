import type { Evaluation, InvestCriterion } from "../generator.types";
import { buildEvaluation, statusForScore } from "./simulateEvaluation";
import { hasOpenAIKey } from "./generateWithOpenAI";

/**
 * Server-only bridge to OpenAI for INVEST evaluation. Real counterpart to
 * {@link buildEvaluation}: it scores an existing user story against the six
 * INVEST criteria and proposes an improved version. The API key is read from
 * the environment and never leaves the server.
 */

export { hasOpenAIKey };

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const DEFAULT_MODEL = "gpt-4o-mini";

const INVEST_NAMES: Record<string, string> = {
  I: "Independent",
  N: "Negotiable",
  V: "Valuable",
  E: "Estimable",
  S: "Small",
  T: "Testable",
};
const INVEST_ORDER = ["I", "N", "V", "E", "S", "T"];

function readApiKey(): string | undefined {
  return process.env.OPENAI_API_KEY ?? process.env.API;
}

const SYSTEM_PROMPT = [
  "Du bist ein Experte für Anforderungsqualität und bewertest User Stories",
  "nach den sechs INVEST-Kriterien (Independent, Negotiable, Valuable,",
  "Estimable, Small, Testable). Du gibst pro Kriterium einen Score von 0-100",
  "und eine kurze deutsche Begründung, schlägst eine verbesserte Story vor und",
  "nennst konkrete Verbesserungsvorschläge.",
  "Antworte ausschließlich mit JSON nach dem Schema, ohne Erklärtext.",
].join(" ");

function buildUserPrompt(story: string): string {
  return [
    "Zu bewertende User Story:",
    story.trim(),
    "",
    "Gib ein JSON-Objekt mit genau diesen Feldern zurück:",
    "{",
    '  "criteria": [ { "id": "I"|"N"|"V"|"E"|"S"|"T", "score": number (0-100),',
    '                  "reason": string (kurze deutsche Begründung) } , ... genau 6 Einträge ],',
    '  "improvedStory": string (verbesserte User Story im "Als ... möchte ich ..., damit ..."-Format),',
    '  "suggestions": string[] (2-4 konkrete Verbesserungsvorschläge)',
    "}",
  ].join("\n");
}

interface RawCriterion {
  id?: unknown;
  score?: unknown;
  reason?: unknown;
}
interface RawEvaluation {
  criteria?: unknown;
  improvedStory?: unknown;
  suggestions?: unknown;
}

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function clampScore(value: unknown, fallback = 60): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(100, Math.round(n)));
}

/** Coerce the model's JSON into a well-formed Evaluation in fixed INVEST order. */
function toEvaluation(raw: RawEvaluation, story: string): Evaluation {
  const fallback = buildEvaluation(story);
  const byId = new Map<string, RawCriterion>();
  if (Array.isArray(raw.criteria)) {
    for (const c of raw.criteria as RawCriterion[]) {
      const id = str(c?.id).toUpperCase();
      if (INVEST_ORDER.includes(id)) byId.set(id, c);
    }
  }

  const criteria: InvestCriterion[] = INVEST_ORDER.map((id, i) => {
    const rc = byId.get(id);
    const fb = fallback.criteria[i];
    const score = rc ? clampScore(rc.score, fb.score) : fb.score;
    return {
      id,
      name: INVEST_NAMES[id],
      score,
      status: statusForScore(score),
      reason: rc ? str(rc.reason, fb.reason) : fb.reason,
    };
  });

  const overallScore = Math.round(
    criteria.reduce((sum, c) => sum + c.score, 0) / criteria.length,
  );

  const suggestions = Array.isArray(raw.suggestions)
    ? (raw.suggestions as unknown[]).map((s) => str(s)).filter(Boolean)
    : [];

  return {
    overallScore,
    criteria,
    improvedStory: str(raw.improvedStory, fallback.improvedStory),
    suggestions: suggestions.length > 0 ? suggestions : fallback.suggestions,
  };
}

export interface EvaluateOptions {
  /** Abort the request after this many ms (default 20s). */
  timeoutMs?: number;
}

/**
 * Evaluate a user story via OpenAI. Throws if no key is configured or the API
 * call fails, so the caller can fall back to the local simulator.
 */
export async function evaluateWithOpenAI(
  story: string,
  options: EvaluateOptions = {},
): Promise<Evaluation> {
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
        // Near-deterministic scoring so the Generator's inline score and a
        // later Evaluator run on the same story stay consistent.
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(story) },
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

    const rawEval = JSON.parse(content) as RawEvaluation;
    return toEvaluation(rawEval, story);
  } finally {
    clearTimeout(timeout);
  }
}
