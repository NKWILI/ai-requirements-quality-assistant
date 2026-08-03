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
        {toolbar}
      </div>
      {children}
    </section>
  );
}
