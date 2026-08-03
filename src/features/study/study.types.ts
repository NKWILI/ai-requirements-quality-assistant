import type { Evaluation, UserStory } from "../generator/generator.types";

/** Source of a result: real API or the local simulator fallback. */
export type ResultSource = "openai" | "simulated";

/** A single logged generation during a study session. */
export interface GenerateEvent {
  kind: "generate";
  /** ISO timestamp when the result arrived. */
  at: string;
  /** Raw bullet input the Proband typed. */
  input: string;
  story: UserStory;
  source: ResultSource;
}

/** A single logged evaluation during a study session. */
export interface EvaluateEvent {
  kind: "evaluate";
  at: string;
  /** The user story the Proband pasted into the Evaluator. */
  input: string;
  evaluation: Evaluation;
  source: ResultSource;
}

export type SessionEvent = GenerateEvent | EvaluateEvent;

/** Value exposed by the study-session context. */
export interface StudySessionValue {
  probandId: string;
  setProbandId: (value: string) => void;
  events: SessionEvent[];
  logGenerate: (event: Omit<GenerateEvent, "kind" | "at">) => void;
  logEvaluate: (event: Omit<EvaluateEvent, "kind" | "at">) => void;
  /** Clear the log (and Proband-ID) for the next participant. */
  reset: () => void;
}
