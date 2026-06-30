"use client";

import { useState } from "react";
import type { UserStory } from "../generator.types";
import { formatStoryForClipboard } from "../lib/formatStory";

type Props = {
  story: UserStory;
};

/** Renders a generated user story, its criteria, and a copy action. Context-blind. */
export function UserStoryCard({ story }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(formatStoryForClipboard(story));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be unavailable (e.g. insecure context); fail silently.
    }
  }

  return (
    <article className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3 rounded-2xl border border-border bg-surface-muted p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            User Story
          </p>
          <p className="mt-2 text-lg font-semibold leading-relaxed text-foreground">
            {story.title}
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Ergebnis in die Zwischenablage kopieren"
          className="shrink-0 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {copied ? "Kopiert ✓" : "Ergebnis kopieren"}
        </button>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Akzeptanzkriterien
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {story.acceptanceCriteria.map((criterion, index) => (
            <li
              key={index}
              className="flex gap-3 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground"
            >
              <span className="font-semibold text-accent">{index + 1}.</span>
              <span>{criterion}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
