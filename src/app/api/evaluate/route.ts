import { NextResponse } from "next/server";
import { evaluateWithOpenAI, hasOpenAIKey } from "@/features/generator/lib/evaluateWithOpenAI";
import { buildEvaluation } from "@/features/generator/lib/simulateEvaluation";

/**
 * POST /api/evaluate
 * Body: { story: string }
 * Returns: { evaluation: Evaluation, source: "openai" | "simulated" }
 *
 * Runs server-side so the OpenAI key never reaches the browser. Falls back to
 * the deterministic local simulator when no key is set or the API call fails.
 */
export async function POST(request: Request) {
  let story = "";
  try {
    const body = await request.json();
    story = typeof body?.story === "string" ? body.story : "";
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (story.trim().length === 0) {
    return NextResponse.json({ error: "Bitte eine User Story eingeben." }, { status: 400 });
  }

  if (hasOpenAIKey()) {
    try {
      const evaluation = await evaluateWithOpenAI(story);
      return NextResponse.json({ evaluation, source: "openai" });
    } catch (err) {
      console.error("[api/evaluate] OpenAI call failed, using simulator:", err);
    }
  }

  try {
    const evaluation = buildEvaluation(story);
    return NextResponse.json({ evaluation, source: "simulated" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Evaluation failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
