import { BrandIcon } from "./BrandIcon";

/** Page title block: app mark, title and prototype subtitle. */
export function AppHeader() {
  return (
    <header className="flex items-center gap-3 sm:gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-white shadow-sm sm:h-12 sm:w-12">
        <BrandIcon variant="check" className="h-6 w-6" />
      </span>
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          AI Requirements Quality Assistant
        </h1>
        <p className="text-sm text-muted">
          KI-gestützte Generierung und Bewertung von User Stories
        </p>
      </div>
    </header>
  );
}
