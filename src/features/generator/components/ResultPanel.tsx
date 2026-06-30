import type { GeneratorStatus, UserStory } from "../generator.types";
import { ResultEmptyState } from "./ResultEmptyState";
import { UserStoryCard } from "./UserStoryCard";

type Props = {
  status: GeneratorStatus;
  story: UserStory | null;
};

/** Right pane: switches between empty, loading and result states. Context-blind. */
export function ResultPanel({ status, story }: Props) {
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

  if (status === "done" && story) {
    return <UserStoryCard story={story} />;
  }

  return <ResultEmptyState />;
}
