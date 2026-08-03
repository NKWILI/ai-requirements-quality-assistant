"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  EvaluateEvent,
  GenerateEvent,
  SessionEvent,
  StudySessionValue,
} from "./study.types";

const StudySessionContext = createContext<StudySessionValue | null>(null);

export function StudySessionProvider({ children }: { children: ReactNode }) {
  const [probandId, setProbandId] = useState("");
  const [events, setEvents] = useState<SessionEvent[]>([]);

  const logGenerate = useCallback(
    (event: Omit<GenerateEvent, "kind" | "at">) => {
      setEvents((prev) => [...prev, { ...event, kind: "generate", at: new Date().toISOString() }]);
    },
    [],
  );

  const logEvaluate = useCallback(
    (event: Omit<EvaluateEvent, "kind" | "at">) => {
      setEvents((prev) => [...prev, { ...event, kind: "evaluate", at: new Date().toISOString() }]);
    },
    [],
  );

  const reset = useCallback(() => {
    setEvents([]);
    setProbandId("");
  }, []);

  const value = useMemo<StudySessionValue>(
    () => ({ probandId, setProbandId, events, logGenerate, logEvaluate, reset }),
    [probandId, events, logGenerate, logEvaluate, reset],
  );

  return (
    <StudySessionContext.Provider value={value}>{children}</StudySessionContext.Provider>
  );
}

export function useStudySession(): StudySessionValue {
  const ctx = useContext(StudySessionContext);
  if (!ctx) {
    throw new Error("useStudySession must be used inside a StudySessionProvider");
  }
  return ctx;
}
