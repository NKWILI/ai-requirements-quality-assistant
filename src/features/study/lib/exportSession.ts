import type { SessionEvent } from "../study.types";

/** Human-readable local timestamp, e.g. "03.08.2026, 14:32:05". */
function fmtTime(iso: string): string {
  return new Date(iso).toLocaleString("de-DE");
}

function sourceLabel(source: string): string {
  return source === "openai" ? "KI (OpenAI)" : "Simulator";
}

interface SessionMeta {
  probandId: string;
  events: SessionEvent[];
}

/** Build a filename-safe slug for the Proband-ID (fallback "unbekannt"). */
export function sessionSlug(probandId: string): string {
  const clean = probandId.trim().replace(/[^a-z0-9_-]+/gi, "-").replace(/^-+|-+$/g, "");
  return clean.length > 0 ? clean : "unbekannt";
}

/** Render the whole session log as Markdown. */
export function toMarkdown({ probandId, events }: SessionMeta): string {
  const lines: string[] = [
    "# ARQA — Evaluations-Sitzung",
    "",
    `- **Proband-ID:** ${probandId.trim() || "—"}`,
    `- **Exportiert:** ${fmtTime(new Date().toISOString())}`,
    `- **Ereignisse:** ${events.length}`,
    "",
  ];

  if (events.length === 0) {
    lines.push("_Keine Aktionen aufgezeichnet._");
    return lines.join("\n");
  }

  events.forEach((event, i) => {
    const n = i + 1;
    if (event.kind === "generate") {
      lines.push(
        `## ${n}. Generierung — ${fmtTime(event.at)}`,
        "",
        `**Quelle:** ${sourceLabel(event.source)} · **Qualitätsscore:** ${event.story.qualityScore}%`,
        "",
        "**Eingabe:**",
        "```",
        event.input.trim(),
        "```",
        "",
        `**Generierte User Story:** ${event.story.title}`,
        "",
        "**Akzeptanzkriterien:**",
        ...event.story.acceptanceCriteria.map((c, k) => `${k + 1}. ${c}`),
        "",
      );
    } else {
      lines.push(
        `## ${n}. Bewertung — ${fmtTime(event.at)}`,
        "",
        `**Quelle:** ${sourceLabel(event.source)} · **Gesamt-Score:** ${event.evaluation.overallScore}%`,
        "",
        "**Bewertete User Story:**",
        "```",
        event.input.trim(),
        "```",
        "",
        "**INVEST-Kriterien:**",
        ...event.evaluation.criteria.map(
          (c) => `- **${c.id} ${c.name}:** ${c.score}% — ${c.reason}`,
        ),
        "",
        `**Verbesserter Vorschlag:** ${event.evaluation.improvedStory}`,
        "",
        "**Verbesserungsvorschläge:**",
        ...(event.evaluation.suggestions.length > 0
          ? event.evaluation.suggestions.map((s) => `- ${s}`)
          : ["- Keine — die Story erfüllt die INVEST-Kriterien."]),
        "",
      );
    }
  });

  return lines.join("\n");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Render the session log as a standalone, print-ready HTML document. */
export function toPrintableHtml({ probandId, events }: SessionMeta): string {
  const body = events
    .map((event, i) => {
      const n = i + 1;
      if (event.kind === "generate") {
        return `
          <section>
            <h2>${n}. Generierung <small>${fmtTime(event.at)}</small></h2>
            <p class="meta">Quelle: ${sourceLabel(event.source)} · Qualitätsscore: ${event.story.qualityScore}%</p>
            <p class="label">Eingabe</p>
            <pre>${escapeHtml(event.input.trim())}</pre>
            <p class="label">Generierte User Story</p>
            <p class="story">${escapeHtml(event.story.title)}</p>
            <p class="label">Akzeptanzkriterien</p>
            <ol>${event.story.acceptanceCriteria.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}</ol>
          </section>`;
      }
      return `
        <section>
          <h2>${n}. Bewertung <small>${fmtTime(event.at)}</small></h2>
          <p class="meta">Quelle: ${sourceLabel(event.source)} · Gesamt-Score: ${event.evaluation.overallScore}%</p>
          <p class="label">Bewertete User Story</p>
          <pre>${escapeHtml(event.input.trim())}</pre>
          <p class="label">INVEST-Kriterien</p>
          <ul>${event.evaluation.criteria
            .map((c) => `<li><strong>${c.id} ${escapeHtml(c.name)}:</strong> ${c.score}% — ${escapeHtml(c.reason)}</li>`)
            .join("")}</ul>
          <p class="label">Verbesserter Vorschlag</p>
          <p class="story">${escapeHtml(event.evaluation.improvedStory)}</p>
          <p class="label">Verbesserungsvorschläge</p>
          <ul>${
            event.evaluation.suggestions.length > 0
              ? event.evaluation.suggestions.map((s) => `<li>${escapeHtml(s)}</li>`).join("")
              : "<li>Keine — die Story erfüllt die INVEST-Kriterien.</li>"
          }</ul>
        </section>`;
    })
    .join("");

  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8" />
<title>ARQA Sitzung — Proband ${escapeHtml(probandId.trim() || "unbekannt")}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: system-ui, "Segoe UI", Roboto, Arial, sans-serif; color: #1e293b; max-width: 780px; margin: 2rem auto; padding: 0 1.5rem; line-height: 1.5; }
  h1 { font-size: 1.5rem; margin-bottom: .25rem; }
  h2 { font-size: 1.05rem; margin: 1.75rem 0 .5rem; border-top: 1px solid #e2e8f0; padding-top: 1rem; }
  h2 small { font-weight: 400; color: #64748b; font-size: .8rem; }
  .head-meta { color: #475569; font-size: .9rem; margin: 0 0 1rem; }
  .meta { color: #7c3aed; font-size: .85rem; font-weight: 600; margin: .25rem 0 .75rem; }
  .label { text-transform: uppercase; letter-spacing: .05em; font-size: .7rem; font-weight: 700; color: #94a3b8; margin: .75rem 0 .25rem; }
  .story { font-size: 1rem; }
  pre { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: .75rem; white-space: pre-wrap; font-size: .85rem; }
  ul, ol { margin: .25rem 0; padding-left: 1.25rem; }
  li { margin: .15rem 0; }
  @media print { body { margin: 0; } section { break-inside: avoid; } }
</style>
</head>
<body>
  <h1>ARQA — Evaluations-Sitzung</h1>
  <p class="head-meta">
    Proband-ID: <strong>${escapeHtml(probandId.trim() || "—")}</strong> ·
    Exportiert: ${fmtTime(new Date().toISOString())} ·
    Ereignisse: ${events.length}
  </p>
  ${events.length === 0 ? "<p><em>Keine Aktionen aufgezeichnet.</em></p>" : body}
</body>
</html>`;
}
