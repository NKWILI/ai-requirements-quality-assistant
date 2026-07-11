import { BrandIcon } from "@/components/BrandIcon";

/** Right pane placeholder shown before anything is generated. */
export function ResultEmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
        <BrandIcon className="h-7 w-7" />
      </span>
      <p className="text-base font-semibold text-foreground">
        Bereit zur Generierung
      </p>
      <p className="max-w-[16rem] text-sm text-muted">
        Stichpunkte eingeben und auf „Generieren“ klicken
      </p>
    </div>
  );
}
