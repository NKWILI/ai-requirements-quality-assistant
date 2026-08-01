import { NextResponse } from "next/server";
import { generateWithOpenAI, hasOpenAIKey } from "@/features/generator/lib/generateWithOpenAI";
import { evaluateWithOpenAI } from "@/features/generator/lib/evaluateWithOpenAI";
import { simulateUserStory } from "@/features/generator/lib/simulateUserStory";
import { buildEvaluation } from "@/features/generator/lib/simulateEvaluation";
import { UnusableInputError, looksMeaningful, unusableMessage } from "@/features/generator/lib/errors";
import type { UserStory } from "@/features/generator/generator.types";

/**
 * POST /api/generate
 * Body: { input: string }
 * Returns: { story: UserStory, source: "openai" | "simulated" }
 *   or 422 { error } when the input carries no recognisable requirement.
 *
 * Runs server-side so the OpenAI key never reaches the browser. The quality
 * score is derived from the SAME INVEST evaluation the Evaluator uses, so both
 * tabs agree on a story's score.
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

  // Cheap gate before spending an API call on obvious keyboard-mashing.
  if (!looksMeaningful(input)) {
    return NextResponse.json({ error: unusableMessage() }, { status: 422 });
  }

  const useOpenAI = hasOpenAIKey();

  let story: UserStory;
  let source: "openai" | "simulated";
  try {
    if (useOpenAI) {
      story = await generateWithOpenAI(input);
      source = "openai";
    } else {
      story = await simulateUserStory(input, { delayMs: 0 });
      source = "simulated";
    }
  } catch (err) {
    // Meaningless input must surface to the user, never be fabricated.
    if (err instanceof UnusableInputError) {
      return NextResponse.json({ error: err.message }, { status: 422 });
    }
    // Any other failure (network, API, parse): fall back to the simulator.
    console.error("[api/generate] generation failed, using simulator:", err);
    try {
      story = await simulateUserStory(input, { delayMs: 0 });
      source = "simulated";
    } catch (fallbackErr) {
      if (fallbackErr instanceof UnusableInputError) {
        return NextResponse.json({ error: fallbackErr.message }, { status: 422 });
      }
      const message = fallbackErr instanceof Error ? fallbackErr.message : "Generation failed.";
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }

  // Score the generated story with the same INVEST logic as the Evaluator so
  // the number shown here matches what the Evaluator tab would report.
  story.qualityScore = await scoreStory(story.title, useOpenAI);

  return NextResponse.json({ story, source });
}

/** Overall INVEST score for a story, via OpenAI when available, else the simulator. */
async function scoreStory(storyText: string, useOpenAI: boolean): Promise<number> {
  try {
    if (useOpenAI) {
      const evaluation = await evaluateWithOpenAI(storyText);
      return evaluation.overallScore;
    }
  } catch (err) {
    console.error("[api/generate] scoring via OpenAI failed, using simulator:", err);
  }
  try {
    return buildEvaluation(storyText).overallScore;
  } catch {
    return 0;
  }
}
