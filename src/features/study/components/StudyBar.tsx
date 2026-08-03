"use client";

import { useStudySession } from "../StudySessionProvider";
import { sessionSlug, toMarkdown, toPrintableHtml } from "../lib/exportSession";

/** Study control strip: Proband-ID, action counter, exports and session reset. */
export function StudyBar() {
  const { probandId, setProbandId, events, reset } = useStudySession();

  const hasEvents = events.length > 0;

  function downloadMarkdown() {
    const md = toMarkdown({ probandId, events });
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `arqa-sitzung_${sessionSlug(probandId)}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function printPdf() {
    const html = toPrintableHtml({ probandId, events });
    const win = window.open("", "_blank");
    if (!win) {
      alert("Bitte Pop-ups für diese Seite erlauben, um als PDF zu exportieren.");
      return;
    }
    win.document.write(html);
    win.document.close();
    win.focus();
    // Give the new document a tick to render before invoking print.
    win.setTimeout(() => win.print(), 250);
  }

  function handleReset() {
    if (hasEvents && !window.confirm("Sitzung zurücksetzen? Das Protokoll wird gelöscht.")) {
      return;
    }
    reset();
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-sm shadow-sm">
      <div className="flex items-center gap-2">
        <label htmlFor="proband-id" className="font-semibold text-muted">
          Proband-ID
        </label>
        <input
          id="proband-id"
          value={probandId}
          onChange={(e) => setProbandId(e.target.value)}
          placeholder="z. B. P01"
          className="w-24 rounded-lg border border-border bg-surface-muted px-2.5 py-1.5 text-foreground focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        />
      </div>

      <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-muted">
        {events.length} {events.length === 1 ? "Aktion" : "Aktionen"} protokolliert
      </span>

      <div className="ms-auto flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={downloadMarkdown}
          disabled={!hasEvents}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          Export .md
        </button>
        <button
          type="button"
          onClick={printPdf}
          disabled={!hasEvents}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          Export PDF
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
        >
          Neue Sitzung
        </button>
      </div>
    </div>
  );
}
