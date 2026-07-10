/** Shows the currently active design variant (Variante A · Scholar Clean). */
export function VariantBadge() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="rounded-full bg-accent-soft px-3 py-1 font-semibold text-accent">
        Variante A
      </span>
      <span className="font-medium text-foreground">Scholar Clean</span>
      <span className="text-muted">
        — Helles Design, strukturierte INVEST-Karten
      </span>
    </div>
  );
}
