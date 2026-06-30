import type { UserStory } from "../generator.types";

/** Render a user story as plain text suitable for the clipboard. */
export function formatStoryForClipboard(story: UserStory): string {
  const lines = [
    story.title,
    "",
    "Akzeptanzkriterien:",
    ...story.acceptanceCriteria.map(
      (criterion, index) => `${index + 1}. ${criterion}`,
    ),
  ];
  return lines.join("\n").trim();
}
