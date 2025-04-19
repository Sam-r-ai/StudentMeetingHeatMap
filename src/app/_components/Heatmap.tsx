import { Major } from "@/db/schema";
import { useQuery } from "@tanstack/react-query";

export default function Heatmap({ heatmapShown, selectedMajors }: { heatmapShown: boolean , selectedMajors: Major[]}) {
  const { data: heatmapData, isFetching } = useQuery<HeatmapDataPoint[]>({
    queryKey: ["heatmapData", selectedMajors.map((m) => m.abbr)],
    queryFn: getHeatmapDataByMajors(selectedMajors.map((m) => m.abbr))
    },
    enabled: heatmapShown && selectedMajors.length > 0,
  });
}
