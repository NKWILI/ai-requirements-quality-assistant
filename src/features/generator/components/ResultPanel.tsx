import type { GeneratorStatus, UserStory } from "../generator.types";
import { ResultEmptyState } from "./ResultEmptyState";
import { UserStoryCard } from "./UserStoryCard";

type Props = {
  status: GeneratorStatus;
  story: UserStory | null;
  error?: string | null;
};

/** Right pane: switches between empty, loading, error and result states. Context-blind. */
export function ResultPanel({ status, story, error }: Props) {
  if (status === "loading") {
    return (
      <div
        role="status"
        className="flex h-full flex-col items-center justify-center gap-3 text-center"
      >
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
        <p className="text-sm font-medium text-muted">Generiere User Story …</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div
        role="alert"
        className="flex h-full flex-col items-center justify-center gap-3 text-center"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-lg text-amber-600">
          !
        </span>
        <p className="max-w-xs text-sm font-medium text-foreground">
          {error ?? "Die Eingabe enthält keine erkennbare Anforderung."}
        </p>
      </div>
    );
  }

  if (status === "done" && story) {
    return <UserStoryCard story={story} />;
  }

  return <ResultEmptyState />;
}
