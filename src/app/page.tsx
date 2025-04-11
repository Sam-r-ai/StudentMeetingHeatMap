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
      <div className="w-full h-full bg-purple-300 max-w-[64rem]">
        Heatmap Here!
      </div>
    </div>
  );
}

export default function Page() {
  const { heatmapShown } = useHeatmap();
  return (
    <div className="p-4 h-screen text-2xl">
      <div className="px-4 w-full h-full rounded-lg">
        <div className="flex flex-col justify-center items-center w-full h-full">
          <MajorForm />
          {heatmapShown && <HeatMap />}
        </div>
      </div>
    </div>
  );
}
