"use client";

import { useState } from "react";
import type { UserStory } from "../generator.types";
import { formatStoryForClipboard } from "../lib/formatStory";

type Props = {
  story: UserStory;
};

function scoreColor(score: number): string {
  if (score >= 75) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-danger";
}

/** A role/goal/benefit phrase highlighted inside the generated sentence. */
function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded bg-highlight px-1 py-0.5 font-medium text-foreground">
      {children}
    </span>
  );
}

function Component({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
        {label}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-foreground">{value}</p>
    </div>
  );
}

/** Renders a generated user story, its score, components and a copy action. Context-blind. */
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 rounded-full border border-success/40 bg-success-soft px-3 py-1 text-xs font-semibold text-success">
            ✓ Generiert
          </span>
          <span className="text-sm text-muted">
            Qualitätsscore:{" "}
            <strong className={`font-bold ${scoreColor(story.qualityScore)}`}>
              {story.qualityScore}%
            </strong>
          </span>
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

      <div className="rounded-2xl border border-border bg-accent-soft/50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
          Generierte User Story
        </p>
        <p className="mt-3 text-lg leading-relaxed text-foreground">
          Als <Highlight>{story.role}</Highlight> möchte ich{" "}
          <Highlight>{story.goal}</Highlight>, damit{" "}
          <Highlight>{story.benefit}</Highlight>.
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Story-Komponenten
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Component label="Rolle" value={story.role} />
          <Component label="Ziel" value={story.goal} />
          <Component label="Nutzen" value={story.benefit} />
        </div>
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
