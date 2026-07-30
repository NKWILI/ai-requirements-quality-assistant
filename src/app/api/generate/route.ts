import { NextResponse } from "next/server";
import { generateWithOpenAI, hasOpenAIKey } from "@/features/generator/lib/generateWithOpenAI";
import { simulateUserStory } from "@/features/generator/lib/simulateUserStory";

/**
 * POST /api/generate
 * Body: { input: string }
 * Returns: { story: UserStory, source: "openai" | "simulated" }
 *
 * Runs server-side so the OpenAI key never reaches the browser. Falls back to
 * the deterministic local simulator when no key is set or the API call fails,
 * so the demo keeps working offline.
 */
export async function POST(request: Request) {
  let input = "";
  try {
    const body = await request.json();
    input = typeof body?.input === "string" ? body.input : "";
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (input.trim().length === 0) {
    return NextResponse.json({ error: "Bitte mindestens einen Stichpunkt eingeben." }, { status: 400 });
  }

  if (hasOpenAIKey()) {
    try {
      const story = await generateWithOpenAI(input);
      return NextResponse.json({ story, source: "openai" });
    } catch (err) {
      // Log server-side for debugging, then fall back to the simulator.
      console.error("[api/generate] OpenAI call failed, using simulator:", err);
    }
  }

  try {
    const story = await simulateUserStory(input, { delayMs: 0 });
    return NextResponse.json({ story, source: "simulated" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
