"use client";

export type TabId = "generator" | "evaluator";

type Tab = {
  id: TabId;
  label: string;
  disabled?: boolean;
};

type Props = {
  tabs: Tab[];
  active: TabId;
  onSelect?: (id: TabId) => void;
};

/** Presentational segmented control. Holds no state — the active tab is a prop. */
export function TabSwitcher({ tabs, active, onSelect }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Modus"
      className="inline-flex gap-1 rounded-xl bg-surface-muted p-1"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => onSelect?.(tab.id)}
            className={[
              "rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              isActive
                ? "bg-accent text-white shadow-sm"
                : "text-muted hover:text-foreground",
              tab.disabled ? "cursor-not-allowed opacity-50 hover:text-muted" : "",
            ].join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
