import { AppHeader } from "@/components/AppHeader";
import { VariantBadge } from "@/components/VariantBadge";
import { GeneratorFeature } from "@/features/generator/GeneratorFeature";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10">
      <AppHeader />
      <VariantBadge />
      <GeneratorFeature />
    </main>
  );
}
