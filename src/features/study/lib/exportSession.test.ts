import { describe, it, expect } from "vitest";
import { sessionSlug, toMarkdown, toPrintableHtml } from "./exportSession";
import type { SessionEvent } from "../study.types";

const events: SessionEvent[] = [
  {
    kind: "generate",
    at: "2026-08-03T12:00:00.000Z",
    input: "- Berichte exportieren\n- als PDF",
    source: "openai",
    story: {
      title: "Als Nutzer möchte ich Berichte exportieren, damit ich sie teilen kann.",
      role: "Nutzer",
      goal: "Berichte exportieren",
      benefit: "ich sie teilen kann",
      qualityScore: 80,
      acceptanceCriteria: ["Export als PDF möglich", "Datei wird gespeichert"],
    },
  },
  {
    kind: "evaluate",
    at: "2026-08-03T12:05:00.000Z",
    input: "Als Nutzer möchte ich mich einloggen, damit ich die App nutzen kann.",
    source: "simulated",
    evaluation: {
      overallScore: 72,
      criteria: [
        { id: "V", name: "Valuable", score: 45, status: "danger", reason: "Nutzen zu vage." },
      ],
      improvedStory: "Als registrierter Nutzer möchte ich …",
      suggestions: ["Rolle konkretisieren."],
    },
  },
];

describe("sessionSlug", () => {
  it("keeps safe characters and falls back when empty", () => {
    expect(sessionSlug("P01")).toBe("P01");
    expect(sessionSlug("  ")).toBe("unbekannt");
    expect(sessionSlug("Proband 1/2")).toBe("Proband-1-2");
  });
});

describe("toMarkdown", () => {
  it("includes the Proband-ID, counts and both event types", () => {
    const md = toMarkdown({ probandId: "P01", events });
    expect(md).toContain("**Proband-ID:** P01");
    expect(md).toContain("**Ereignisse:** 2");
    expect(md).toContain("1. Generierung");
    expect(md).toContain("2. Bewertung");
    expect(md).toContain("Als Nutzer möchte ich Berichte exportieren");
    expect(md).toContain("V Valuable:** 45%");
  });

  it("handles an empty session gracefully", () => {
    const md = toMarkdown({ probandId: "", events: [] });
    expect(md).toContain("Keine Aktionen aufgezeichnet");
  });
});

describe("toPrintableHtml", () => {
  it("produces a full HTML document and escapes angle brackets", () => {
    const html = toPrintableHtml({
      probandId: "P01",
      events: [
        {
          ...(events[0] as Extract<SessionEvent, { kind: "generate" }>),
          input: "a < b > c",
        },
      ],
    });
    expect(html.startsWith("<!doctype html>")).toBe(true);
    expect(html).toContain("ARQA — Evaluations-Sitzung");
    expect(html).toContain("a &lt; b &gt; c");
  });
});
