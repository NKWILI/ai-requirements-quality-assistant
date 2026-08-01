import type { UserStory } from "../generator.types";
import { UnusableInputError, looksMeaningful, unusableMessage } from "./errors";

/**
 * Simulated "AI". This module is the single seam where a real Claude API call
 * could later replace the deterministic local logic without touching the
 * Provider or the UI. For the Demo-Modus it assembles a user story from the
 * raw bullet points using simple, deterministic heuristics.
 */

const BULLET_PREFIX = /^[-*•]\s*/;
const ROLE_VERB_PREFIX = /^(?:der|die|das)?\s*\w+\s+(?:soll|kann|will|muss|möchte)\s+/i;

/** Split raw input into trimmed bullet lines, dropping markers and blanks. */
export function parseBullets(input: string): string[] {
  return input
    .split("\n")
    .map((line) => line.replace(BULLET_PREFIX, "").trim())
    .filter((line) => line.length > 0);
}

function lowerFirst(text: string): string {
  return text.length === 0 ? text : text[0].toLowerCase() + text.slice(1);
}

function upperFirst(text: string): string {
  return text.length === 0 ? text : text[0].toUpperCase() + text.slice(1);
}

function detectRole(bullets: string[]): string {
  const haystack = bullets.join(" ").toLowerCase();
  if (/\b(admin|administrator|administratorin)\b/.test(haystack)) {
    return "Administrator";
  }
  return "Nutzer";
}

/** Turn a bullet into the "möchte ich …" goal phrase. */
function toGoal(bullet: string): string {
  return upperFirst(bullet.replace(ROLE_VERB_PREFIX, "").trim());
}

/**
 * Derive the "damit …" benefit clause. The simulator is only a fallback, so it
 * deliberately uses a fixed, always-grammatical clause instead of splicing a
 * raw bullet into the sentence (which produced broken German like
 * "damit ich per E-Mail versenden kann").
 */
function toBenefit(bullets: string[]): string {
  return bullets.length > 1
    ? "der Arbeitsablauf effizienter und nachvollziehbarer wird"
    : "der Arbeitsablauf effizienter wird";
}

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export interface QualityFactors {
  bulletCount: number;
  goalWordCount: number;
  hasExplicitBenefit: boolean;
  maxBulletWords: number;
}

/**
 * Deterministic "AI" quality score. Rewards stories that come from richer,
 * more detailed input (several bullets, a substantial goal, an explicit
 * benefit). Clamped so the demo never claims a perfect score.
 */
export function computeQualityScore(factors: QualityFactors): number {
  let score = 50;
  score += Math.min(factors.bulletCount, 4) * 5;
  if (factors.hasExplicitBenefit) score += 8;
  if (factors.goalWordCount >= 2) score += 5;
  if (factors.maxBulletWords >= 4) score += 5;
  return Math.max(30, Math.min(98, Math.round(score)));
}

/** Build a deterministic user story from raw bullet input. */
export function buildUserStory(input: string): UserStory {
  const bullets = parseBullets(input);
  if (bullets.length === 0) {
    throw new Error("Bitte mindestens einen Stichpunkt eingeben.");
  }
  if (!looksMeaningful(input)) {
    throw new UnusableInputError(unusableMessage());
  }

  const role = detectRole(bullets);
  const goal = toGoal(bullets[0]);
  const benefit = toBenefit(bullets);
  const title = `Als ${role} möchte ich ${lowerFirst(goal)}, damit ${benefit}.`;
  const acceptanceCriteria = bullets.map((bullet) => upperFirst(bullet));
  const qualityScore = computeQualityScore({
    bulletCount: bullets.length,
    goalWordCount: wordCount(goal),
    hasExplicitBenefit: bullets.length > 1,
    maxBulletWords: Math.max(...bullets.map(wordCount)),
  });

  return { title, role, goal, benefit, qualityScore, acceptanceCriteria };
}

export interface SimulateOptions {
  /** Artificial latency to mimic a network round-trip (default 900ms). */
  delayMs?: number;
}

/** Async wrapper that mimics a real generation request with latency. */
export async function simulateUserStory(
  input: string,
  options: SimulateOptions = {},
): Promise<UserStory> {
  const { delayMs = 900 } = options;
  // Build first so invalid input rejects immediately, before the delay.
  const story = buildUserStory(input);
  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  return story;
}
