import type { Evaluation, InvestCriterion, InvestStatus } from "../generator.types";

/**
 * Deterministic INVEST evaluation used as the offline fallback for the
 * Evaluator, mirroring {@link simulateUserStory} for the Generator. It applies
 * simple heuristics to the story text so the demo still returns something
 * plausible without an API key.
 */

const INVEST_NAMES: Array<{ id: string; name: string }> = [
  { id: "I", name: "Independent" },
  { id: "N", name: "Negotiable" },
  { id: "V", name: "Valuable" },
  { id: "E", name: "Estimable" },
  { id: "S", name: "Small" },
  { id: "T", name: "Testable" },
];

/** Map a numeric score to a traffic-light status. */
export function statusForScore(score: number): InvestStatus {
  if (score >= 70) return "success";
  if (score >= 50) return "warning";
  return "danger";
}

function hasFormat(text: string): boolean {
  return /als\s+.+möchte\s+ich\s+.+damit\s+.+/i.test(text);
}

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export function buildEvaluation(story: string): Evaluation {
  const text = story.trim();
  if (text.length === 0) {
    throw new Error("Bitte eine User Story eingeben.");
  }

  const lower = text.toLowerCase();
  const formatted = hasFormat(text);
  const words = wordCount(text);
  const specificRole = /registriert|admin|kunde|redakteur|manager/i.test(lower);
  const hasBenefit = /damit\s+.+/i.test(lower) && !/damit ich die app nutzen kann/i.test(lower);
  const vague = /\bapp nutzen\b|\betwas\b|\bdinge\b/i.test(lower);

  const scores: Record<string, number> = {
    I: 70 + (words > 8 ? 10 : 0),
    N: formatted ? 60 : 45,
    V: hasBenefit && !vague ? 75 : vague ? 40 : 55,
    E: words >= 8 ? 65 : 50,
    S: words <= 25 ? 78 : 55,
    T: /akzeptanzkriteri|wenn|dann|testbar/i.test(lower) ? 70 : 40,
  };
  if (specificRole) scores.V += 5;

  const criteria: InvestCriterion[] = INVEST_NAMES.map(({ id, name }) => {
    // Allow a perfect 100 so an excellent story is not artificially capped.
    const score = Math.max(20, Math.min(100, Math.round(scores[id])));
    return { id, name, score, status: statusForScore(score), reason: reasonFor(id, score) };
  });

  const overallScore = Math.round(
    criteria.reduce((sum, c) => sum + c.score, 0) / criteria.length,
  );

  return {
    overallScore,
    criteria,
    improvedStory: improve(text, specificRole, hasBenefit),
    suggestions: buildSuggestions(specificRole, hasBenefit, scores.T < 50),
  };
}

function reasonFor(id: string, score: number): string {
  const good = score >= 70;
  const mid = score >= 50;
  switch (id) {
    case "I":
      return good ? "Eigenständig und unabhängig umsetzbar." : "Abhängigkeiten sind nicht klar getrennt.";
    case "N":
      return mid ? "Grundlegend verhandelbar." : "Wenig Spielraum für Verhandlung erkennbar.";
    case "V":
      return good ? "Konkreter Mehrwert erkennbar." : "Der Mehrwert ist zu vage formuliert.";
    case "E":
      return mid ? "Schätzbar, Details könnten präziser sein." : "Zu wenig Details für eine Schätzung.";
    case "S":
      return good ? "Angemessener, sprintfähiger Umfang." : "Umfang könnte zu groß sein.";
    case "T":
      return good ? "Testbar mit klaren Kriterien." : "Keine Akzeptanzkriterien — schwer testbar.";
    default:
      return "";
  }
}

function improve(text: string, specificRole: boolean, hasBenefit: boolean): string {
  if (specificRole && hasBenefit) return text;
  return "Als registrierter Nutzer möchte ich mich mit E-Mail und Passwort anmelden, damit ich auf meine persönlichen Daten und gespeicherten Einstellungen zugreifen kann.";
}

function buildSuggestions(specificRole: boolean, hasBenefit: boolean, notTestable: boolean): string[] {
  const out: string[] = [];
  if (!specificRole) out.push('Nutzerrolle konkretisieren: "registrierter Nutzer" statt generisch "Nutzer".');
  if (!hasBenefit) out.push("Nutzenformulierung schärfen: Was ermöglicht die Story konkret?");
  if (notTestable) out.push("Mindestens 3 messbare Akzeptanzkriterien hinzufügen.");
  // No forced suggestion: an already-good story returns an empty list so the
  // UI can show "Keine Verbesserungen nötig".
  return out;
}
