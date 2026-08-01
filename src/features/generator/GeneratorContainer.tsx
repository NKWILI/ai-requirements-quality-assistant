"use client";

import { useState } from "react";
import { ArqaCard } from "@/components/ArqaCard";
import { TabSwitcher, type TabId } from "@/components/TabSwitcher";
import { useGenerator } from "./GeneratorProvider";
import { GeneratorInput } from "./components/GeneratorInput";
import { ResultPanel } from "./components/ResultPanel";
// 1. TON IMPORT : On relie ton nouveau fichier ici
import Evaluator from "./components/Evaluator";

/**
 * The bridge layer: the only file allowed to read the Generator context.
 * Holds local UI state (the active tab) and arranges the Components.
 */
export function GeneratorContainer() {
  const { input, setInput, status, story, error, isEmpty, generate } = useGenerator();
  const [activeTab, setActiveTab] = useState<TabId>("generator");

  const loading = status === "loading";

  return (
    <ArqaCard
      toolbar={
        <TabSwitcher
          active={activeTab}
          onSelect={setActiveTab}
          tabs={[
            { id: "generator", label: "Generator" },
            // 2. ONGLET DÉBLOQUÉ : On a retiré le `disabled: true`
            { id: "evaluator", label: "Evaluator" },
          ]}
        />
      }
    >
      {/* 3. LOGIQUE D'AFFICHAGE : Generator (Alain) ou Evaluator (Toi) */}
      {activeTab === "generator" ? (
        <div className="grid gap-px bg-border md:grid-cols-2">
          <div className="bg-surface p-6">
            <GeneratorInput
              value={input}
              onChange={setInput}
              onSubmit={generate}
              loading={loading}
              disabled={loading || isEmpty}
            />
          </div>
          <div className="min-h-[24rem] bg-surface p-6">
            <ResultPanel status={status} story={story} error={error} />
          </div>
        </div>
      ) : (
        <Evaluator />
      )}
    </ArqaCard>
  );
}