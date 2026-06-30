import { AppHeader } from "@/components/AppHeader";
import { VariantBadge } from "@/components/VariantBadge";
import { ArqaCard } from "@/components/ArqaCard";
import { TabSwitcher } from "@/components/TabSwitcher";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10">
      <AppHeader />
      <VariantBadge />
      <ArqaCard
        toolbar={
          <TabSwitcher
            active="generator"
            tabs={[
              { id: "generator", label: "Generator" },
              { id: "evaluator", label: "Evaluator", disabled: true },
            ]}
          />
        }
      >
        <div className="px-6 py-16 text-center text-sm text-muted">
          Generator folgt in Task 3.
        </div>
      </ArqaCard>
    </main>
  );
}
