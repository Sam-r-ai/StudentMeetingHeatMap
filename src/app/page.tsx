"use client";

import MajorSelection from "@/app/_components/MajorSelection";
import { useHeatmap } from "./_context/heatmapShown";

function MajorForm() {
  return (
    <div className="flex flex-col gap-1 items-center">
      <p>Select a major!</p>
      <MajorSelection />
    </div>
  );
}

function HeatMap() {
  return (
    <div className="flex justify-center p-4 w-full grow">
      <div className="w-full bg-purple-300 h-128 max-w-[64rem]">
        Heatmap Here!
      </div>
    </div>
  );
}

export default function Page() {
  const { heatmapShown } = useHeatmap();
  return (
    <div className="p-4 h-full text-2xl text-foreground">
      <div className="px-4 w-full h-full rounded-lg">
        <div className="flex flex-col justify-center items-center w-full h-full">
          <MajorForm />
          {heatmapShown && (
            <div className="flex w-full duration-300 animate-in fade-in slide-in-from-bottom grow">
              <HeatMap />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
