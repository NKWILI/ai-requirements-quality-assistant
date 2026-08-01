/** Status of the generation request. */
export type GeneratorStatus = "idle" | "loading" | "done" | "error";

/** A generated user story in the German "Als … möchte ich …, damit …" format. */
export interface UserStory {
  /** Full one-line story sentence. */
  title: string;
  role: string;
  goal: string;
  benefit: string;
  /** Simulated AI confidence in the story quality, 0–100. */
  qualityScore: number;
  /** One acceptance criterion per input bullet. */
  acceptanceCriteria: string[];
}

/** Traffic-light status for a single INVEST criterion. */
export type InvestStatus = "success" | "warning" | "danger";

/** One INVEST criterion with a real (0–100) score and a short rationale. */
export interface InvestCriterion {
  /** Single-letter id: I, N, V, E, S or T. */
  id: string;
  /** Full criterion name, e.g. "Independent". */
  name: string;
  /** Score for this criterion, 0–100. */
  score: number;
  status: InvestStatus;
  /** Short German explanation of the score. */
  reason: string;
}

/** Result of an INVEST evaluation of an existing user story. */
export interface Evaluation {
  /** Weighted overall INVEST score, 0–100. */
  overallScore: number;
  /** Exactly the six INVEST criteria, in I-N-V-E-S-T order. */
  criteria: InvestCriterion[];
  /** A rewritten, higher-quality version of the story. */
  improvedStory: string;
  /** Concrete improvement suggestions. */
  suggestions: string[];
}

/** Value exposed by the Generator context. */
export interface GeneratorContextValue {
  input: string;
  setInput: (value: string) => void;
  status: GeneratorStatus;
  story: UserStory | null;
  /** User-facing message when status is "error" (e.g. unusable input). */
  error: string | null;
  isEmpty: boolean;
  generate: () => Promise<void>;
  reset: () => void;
}
