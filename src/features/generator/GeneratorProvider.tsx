"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { GeneratorContextValue, GeneratorStatus, UserStory } from "./generator.types";
import { simulateUserStory } from "./lib/simulateUserStory";

const GeneratorContext = createContext<GeneratorContextValue | null>(null);

const SAMPLE_INPUT = [
  "- Nutzer soll Stichpunkte eingeben",
  "- Automatisch User Story generieren",
  "- Ergebnis kopieren können",
].join("\n");

export function GeneratorProvider({ children }: { children: ReactNode }) {
  const [input, setInput] = useState(SAMPLE_INPUT);
  const [status, setStatus] = useState<GeneratorStatus>("idle");
  const [story, setStory] = useState<UserStory | null>(null);

  const isEmpty = useMemo(() => input.trim().length === 0, [input]);

  const generate = useCallback(async () => {
    if (input.trim().length === 0) return;
    setStatus("loading");
    setStory(null);
    try {
      // Real generation happens server-side (/api/generate) so the API key
      // stays on the server. If the request fails, fall back to the local
      // simulator so the demo keeps working.
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = (await res.json()) as { story: UserStory };
      setStory(data.story);
      setStatus("done");
    } catch {
      try {
        const result = await simulateUserStory(input);
        setStory(result);
        setStatus("done");
      } catch {
        setStatus("idle");
      }
    }
  }, [input]);

  const reset = useCallback(() => {
    setStory(null);
    setStatus("idle");
  }, []);

  const value = useMemo<GeneratorContextValue>(
    () => ({ input, setInput, status, story, isEmpty, generate, reset }),
    [input, status, story, isEmpty, generate, reset],
  );

  return (
    <GeneratorContext.Provider value={value}>{children}</GeneratorContext.Provider>
  );
}

export function useGenerator(): GeneratorContextValue {
  const ctx = useContext(GeneratorContext);
  if (!ctx) {
    throw new Error("useGenerator must be used inside a GeneratorProvider");
  }
  return ctx;
}
