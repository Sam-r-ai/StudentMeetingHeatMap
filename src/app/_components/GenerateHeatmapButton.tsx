import { useHeatmap } from "@/app/_context/heatmapShown";
import { Button } from "@/components/ui/button";

export default function GenerateHeatmapButton() {
  const { setHeatmapShow } = useHeatmap();
  return (
    <Button
      variant="default"
      className="rounded-md hover:cursor-pointer"
      onMouseDown={() => setHeatmapShow(true)}
    >
      Generate Heatmap
    </Button>
  );
}
