import { BrandIcon } from "./BrandIcon";

/** Page title block: app mark, title and prototype subtitle. */
export function AppHeader() {
  return (
    <header className="flex items-center gap-4">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-white shadow-sm">
        <BrandIcon variant="check" className="h-6 w-6" />
      </span>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          AI Requirements Quality Assistant
        </h1>
        <p className="text-sm text-muted">
          KI-gestützte Generierung und Bewertung von User Stories
        </p>
      </div>
    </header>
  );
}
