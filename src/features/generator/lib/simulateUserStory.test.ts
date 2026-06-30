import { describe, it, expect } from "vitest";
import {
  parseBullets,
  buildUserStory,
  simulateUserStory,
  computeQualityScore,
} from "./simulateUserStory";

describe("parseBullets", () => {
  it("strips -, *, • markers and trims, dropping empty lines", () => {
    const result = parseBullets("- a\n* b\n•  c\n\n   d  \n");
    expect(result).toEqual(["a", "b", "c", "d"]);
  });

  it("returns an empty array for blank input", () => {
    expect(parseBullets("   \n  \t ")).toEqual([]);
  });
});

describe("buildUserStory", () => {
  it("throws when there is no usable input", () => {
    expect(() => buildUserStory("")).toThrow();
    expect(() => buildUserStory("   \n  ")).toThrow();
  });

  it("produces a title in the 'Als … möchte ich …, damit …' format", () => {
    const story = buildUserStory("Stichpunkte eingeben\nUser Story sehen");
    expect(story.title).toMatch(/^Als .+ möchte ich .+, damit .+\.$/);
  });

  it("defaults the role to 'Nutzer'", () => {
    const story = buildUserStory("Stichpunkte eingeben");
    expect(story.role).toBe("Nutzer");
    expect(story.title.startsWith("Als Nutzer")).toBe(true);
  });

  it("detects an administrator role from the bullets", () => {
    const story = buildUserStory("Admin soll Nutzerkonten verwalten");
    expect(story.role).toBe("Administrator");
  });

  it("strips a leading '<role> soll' prefix from the goal", () => {
    const story = buildUserStory("Nutzer soll Stichpunkte eingeben");
    expect(story.goal).toBe("Stichpunkte eingeben");
  });

  it("creates one non-empty acceptance criterion per bullet", () => {
    const story = buildUserStory(
      "- Stichpunkte eingeben\n- User Story generieren\n- Ergebnis kopieren",
    );
    expect(story.acceptanceCriteria).toHaveLength(3);
    for (const ac of story.acceptanceCriteria) {
      expect(ac.trim().length).toBeGreaterThan(0);
    }
  });

  it("is deterministic for the same input", () => {
    const a = buildUserStory("Stichpunkte eingeben\nErgebnis kopieren");
    const b = buildUserStory("Stichpunkte eingeben\nErgebnis kopieren");
    expect(a).toEqual(b);
  });

  it("attaches an integer quality score between 0 and 100", () => {
    const story = buildUserStory("Stichpunkte eingeben\nErgebnis kopieren");
    expect(Number.isInteger(story.qualityScore)).toBe(true);
    expect(story.qualityScore).toBeGreaterThanOrEqual(0);
    expect(story.qualityScore).toBeLessThanOrEqual(100);
  });
});

describe("computeQualityScore", () => {
  it("stays within 0 and 100 for extreme inputs", () => {
    const low = computeQualityScore({
      bulletCount: 0,
      goalWordCount: 0,
      hasExplicitBenefit: false,
      maxBulletWords: 0,
    });
    const high = computeQualityScore({
      bulletCount: 12,
      goalWordCount: 12,
      hasExplicitBenefit: true,
      maxBulletWords: 12,
    });
    expect(low).toBeGreaterThanOrEqual(0);
    expect(high).toBeLessThanOrEqual(100);
  });

  it("rewards richer, more detailed input", () => {
    const minimal = computeQualityScore({
      bulletCount: 1,
      goalWordCount: 1,
      hasExplicitBenefit: false,
      maxBulletWords: 1,
    });
    const rich = computeQualityScore({
      bulletCount: 3,
      goalWordCount: 3,
      hasExplicitBenefit: true,
      maxBulletWords: 5,
    });
    expect(rich).toBeGreaterThan(minimal);
  });
});

describe("simulateUserStory", () => {
  it("resolves to the same story buildUserStory would produce", async () => {
    const input = "Stichpunkte eingeben\nUser Story generieren";
    const story = await simulateUserStory(input, { delayMs: 0 });
    expect(story).toEqual(buildUserStory(input));
  });
});
