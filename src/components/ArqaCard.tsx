import type { ReactNode } from "react";
import { BrandIcon } from "./BrandIcon";

type Props = {
  /** Right-aligned slot in the card header — typically the tab switcher. */
  toolbar?: ReactNode;
  children: ReactNode;
};

/** White product card: ARQA / BETA brand row plus a body. */
export function ArqaCard({ toolbar, children }: Props) {
  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white">
            <BrandIcon className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">
            ARQA
          </span>
          <span className="rounded-md bg-accent-soft px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-accent">
            Beta
          </span>
        </div>
        {toolbar}
      </div>
      {children}
    </section>
  );
}
