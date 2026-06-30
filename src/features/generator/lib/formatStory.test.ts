import { describe, it, expect } from "vitest";
import { formatStoryForClipboard } from "./formatStory";
import { buildUserStory } from "./simulateUserStory";

describe("formatStoryForClipboard", () => {
  it("includes the story title on the first line", () => {
    const story = buildUserStory("Stichpunkte eingeben\nErgebnis kopieren");
    const text = formatStoryForClipboard(story);
    expect(text.split("\n")[0]).toBe(story.title);
  });

  it("lists every acceptance criterion, numbered", () => {
    const story = buildUserStory("- Eins\n- Zwei\n- Drei");
    const text = formatStoryForClipboard(story);
    expect(text).toContain("1. Eins");
    expect(text).toContain("2. Zwei");
    expect(text).toContain("3. Drei");
  });

  it("produces no leading or trailing blank lines", () => {
    const story = buildUserStory("Eins\nZwei");
    const text = formatStoryForClipboard(story);
    expect(text).toBe(text.trim());
  });
});
