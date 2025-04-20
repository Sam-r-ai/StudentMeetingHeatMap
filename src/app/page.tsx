"use client";

import MajorSelection from "@/app/_components/MajorSelection";
import { getHeatmapDataByMajors } from "@/app/actions";
import type { Major } from "@/db/schema";
import { useQuery } from "@tanstack/react-query";
import { useState, useTransition } from "react";
import React from "react";
import Heatmap from "./_components/Heatmap";

export default function Page() {
  const [selectedMajors, setSelectedMajors] = useState<Major[]>([]);
  const [heatmapShown, setHeatmapShown] = useState(false);
  const [, startTransition] = useTransition();

  const {
    data: heatmapData,
    isPending,
    isFetching,
    isError,
    error,
    isStale,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ["heatmapData", selectedMajors],
    queryFn: () => getHeatmapDataByMajors(selectedMajors),
    enabled: false,
  });

  const handleGenerateClick = () => {
    if (selectedMajors.length === 0) {
      alert("Please select at least one major");
      return;
    }

    // refetch({ cancelRefetch: false });
    if (isStale || isPending) {
      refetch();
    }
    startTransition(() => {
      setHeatmapShown(true);
    });
  };

  if (isFetching) {
    console.log("Fetching...");
  }

  return (
    <main className="flex justify-center items-center py-10 h-full text-2xl">
      <div className="flex flex-col gap-4 justify-center items-center p-8 w-full max-w-5xl rounded-xl border border-border">
        <p>Select a major!</p>
        <MajorSelection
          selected={selectedMajors}
          setSelected={setSelectedMajors}
          onGenerateClick={handleGenerateClick}
          isGenerating={isFetching}
        />

        {heatmapShown && (
          <>
            {isFetching && (
              <div className="py-10 text-center">Loading heatmap data...</div>
            )}

            {isError && (
              /* Database error message when there's an error */
              <div className="p-3 mb-4 text-base text-center rounded-md border border-red-200 text-foreground bg-destructive">
                <p className="font-semibold">Database Error</p>
                <p>{error.message}</p>
              </div>
            )}

            {isSuccess && <Heatmap heatmapData={heatmapData} />}
          </>
        )}
      </div>
    </main>
  );
}
