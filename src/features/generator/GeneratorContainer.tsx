"use client";

import { useState } from "react";
import { ArqaCard } from "@/components/ArqaCard";
import { TabSwitcher, type TabId } from "@/components/TabSwitcher";
import { useGenerator } from "./GeneratorProvider";
import { GeneratorInput } from "./components/GeneratorInput";
import { ResultPanel } from "./components/ResultPanel";

/**
 * The bridge layer: the only file allowed to read the Generator context.
 * Holds local UI state (the active tab) and arranges the Components.
 */
export function GeneratorContainer() {
  const { input, setInput, status, story, isEmpty, generate } = useGenerator();
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
            { id: "evaluator", label: "Evaluator", disabled: true },
          ]}
        />
      }
    >
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
          <ResultPanel status={status} story={story} />
        </div>
      </div>
    </ArqaCard>
  );
}
