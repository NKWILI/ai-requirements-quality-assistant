import type { UserStory } from "../generator.types";

type Props = {
  story: UserStory;
};

/** Renders a generated user story and its acceptance criteria. Context-blind. */
export function UserStoryCard({ story }: Props) {
  return (
    <article className="flex flex-col gap-5">
      <div className="rounded-2xl border border-border bg-surface-muted p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
          User Story
        </p>
        <p className="mt-2 text-lg font-semibold leading-relaxed text-foreground">
          {story.title}
        </p>
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
