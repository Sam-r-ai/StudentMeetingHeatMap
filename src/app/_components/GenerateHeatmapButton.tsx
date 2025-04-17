"use client";

import { Button } from "@/components/ui/button";

export default function GenerateHeatmapButton({
  onClick,
  isLoading,
}: {
  onClick: () => void;
  isLoading: boolean;
}) {
  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      variant="default"
      className="py-2 px-4 rounded-md hover:cursor-pointer"
    >
      {isLoading ? "Generating..." : "Generate Heatmap"}
    </Button>
  );
}