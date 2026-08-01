/**
 * Thrown when the user's input carries no recognisable requirement (random
 * characters, keyboard-mashing, empty content). The caller must surface the
 * message to the user instead of fabricating or simulating a story.
 */
export class UnusableInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnusableInputError";
  }
}

const DEFAULT_UNUSABLE =
  "Die Eingabe enthält keine erkennbare Anforderung. Bitte gib aussagekräftige Stichpunkte ein.";

export function unusableMessage(message?: string): string {
  return message && message.trim().length > 0 ? message.trim() : DEFAULT_UNUSABLE;
}

/**
 * Cheap gate against obviously meaningless input. Requires at least one
 * word that looks like a real word: contains a vowel and has 3+ letters.
 * The model does the semantic judging; this just catches empty / symbol-only
 * input so the simulator fallback never invents a story from nothing.
 */
export function looksMeaningful(input: string): boolean {
  const words = input.split(/\s+/).filter(Boolean);
  return words.some((w) => {
    const letters = w.replace(/[^a-zà-ÿ]/gi, "");
    return letters.length >= 3 && /[aeiouyäöü]/i.test(letters);
  });
}
