/** Status of the (simulated) generation request. */
export type GeneratorStatus = "idle" | "loading" | "done";

/** A generated user story in the German "Als … möchte ich …, damit …" format. */
export interface UserStory {
  /** Full one-line story sentence. */
  title: string;
  role: string;
  goal: string;
  benefit: string;
  /** One acceptance criterion per input bullet. */
  acceptanceCriteria: string[];
}

/** Value exposed by the Generator context. */
export interface GeneratorContextValue {
  input: string;
  setInput: (value: string) => void;
  status: GeneratorStatus;
  story: UserStory | null;
  isEmpty: boolean;
  generate: () => Promise<void>;
  reset: () => void;
}
