type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  /** Submit disabled (blank input or already loading). */
  disabled: boolean;
};

/** Left pane: bullet input plus the generate action. Context-blind. */
export function GeneratorInput({
  value,
  onChange,
  onSubmit,
  loading,
  disabled,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-soft text-accent">
          +
        </span>
        <h2 className="text-base font-semibold text-foreground">
          User Story generieren
        </h2>
      </div>

      <p className="text-sm leading-relaxed text-muted">
        Stichpunkte oder Freitext eingeben — KI generiert eine vollständige User
        Story im Format <em>Als … möchte ich …, damit …</em>
      </p>

      <label
        htmlFor="generator-input"
        className="text-xs font-semibold uppercase tracking-wide text-muted"
      >
        Stichpunkte / Anforderungen
      </label>
      <textarea
        id="generator-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={8}
        className="resize-none rounded-2xl border border-border bg-surface-muted px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        placeholder={"- Nutzer soll Berichte exportieren\n- als PDF speichern\n- per E-Mail versenden"}
      />

      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled}
        className="rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Generiere …" : "User Story generieren →"}
      </button>
    </div>
  );
}
