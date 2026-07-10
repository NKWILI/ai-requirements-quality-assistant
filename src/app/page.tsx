import { AppHeader } from "@/components/AppHeader";
import { VariantBadge } from "@/components/VariantBadge";
import { GeneratorFeature } from "@/features/generator/GeneratorFeature";
import EvaluatorDark from "@/components/EvaluatorDark";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-8 px-6 py-10">

      <AppHeader />

      {/* We removed "items-start" so both columns stretch to the exact same height automatically */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">

        {/* COLUMN 1: VARIANT A */}
        <div className="flex flex-col gap-4">
          <VariantBadge />
          {/* We ensure the white card takes the full height of the column */}
          <div className="h-full">
            <GeneratorFeature />
          </div>
        </div>

        {/* COLUMN 2: VARIANT B */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 text-sm ml-1 mb-1">
            <span className="font-semibold text-violet-600 bg-white px-2.5 py-0.5 rounded shadow-sm border border-slate-100">Variante B</span>
            <span className="font-semibold text-slate-800">Studio Dark</span>
            <span className="text-slate-500">— Dunkles Design, kompakte INVEST-Rasteransicht</span>
          </div>

          <EvaluatorDark />
        </div>

      </div>
    </main>
  );
}