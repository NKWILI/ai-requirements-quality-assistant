import { GeneratorProvider } from "./GeneratorProvider";
import { GeneratorContainer } from "./GeneratorContainer";

/** Feature entry point: assembles Provider + Container into a black box. */
export function GeneratorFeature() {
  return (
    <GeneratorProvider>
      <GeneratorContainer />
    </GeneratorProvider>
  );
}
