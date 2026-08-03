import { StudySessionProvider } from "../study/StudySessionProvider";
import { StudyBar } from "../study/components/StudyBar";
import { GeneratorProvider } from "./GeneratorProvider";
import { GeneratorContainer } from "./GeneratorContainer";

/** Feature entry point: assembles the study session, Provider + Container. */
export function GeneratorFeature() {
  return (
    <StudySessionProvider>
      <div className="flex flex-col gap-4">
        <StudyBar />
        <GeneratorProvider>
          <GeneratorContainer />
        </GeneratorProvider>
      </div>
    </StudySessionProvider>
  );
}
