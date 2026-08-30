import { DottedWorldMap } from "@/components/ui/dotted-world-map";
import { worldCities } from "@/config/world-cities";

export function DottedWorldMapDemo() {
  return (
    <div className="w-full max-w-3xl">
      <DottedWorldMap
        points={worldCities}
        dotRadius={1.6}
        spacing={5}
        patternId="dwm-demo"
      />
    </div>
  );
}
