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

export function GeneratorProvider({ children }: { children: ReactNode }) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<GeneratorStatus>("idle");
  const [story, setStory] = useState<UserStory | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isEmpty = useMemo(() => input.trim().length === 0, [input]);

  const generate = useCallback(async () => {
    if (input.trim().length === 0) return;
    setStatus("loading");
    setStory(null);
    setError(null);
    try {
      // Real generation happens server-side (/api/generate) so the API key
      // stays on the server.
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      // 422 = input carries no recognisable requirement. Show the server's
      // message instead of fabricating a story via the local simulator.
      if (res.status === 422) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Die Eingabe enthält keine erkennbare Anforderung.");
        setStatus("error");
        return;
      }
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const data = (await res.json()) as { story: UserStory };
      setStory(data.story);
      setStatus("done");
    } catch {
      // Network / server error only — fall back to the local simulator.
      try {
        const result = await simulateUserStory(input);
        setStory(result);
        setStatus("done");
      } catch (fallbackErr) {
        setError(
          fallbackErr instanceof Error
            ? fallbackErr.message
            : "Generierung fehlgeschlagen.",
        );
        setStatus("error");
      }
    }
  }, [input]);

  const reset = useCallback(() => {
    setStory(null);
    setError(null);
    setStatus("idle");
  }, []);

  const value = useMemo<GeneratorContextValue>(
    () => ({ input, setInput, status, story, error, isEmpty, generate, reset }),
    [input, status, story, error, isEmpty, generate, reset],
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
