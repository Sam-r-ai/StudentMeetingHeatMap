import { useMemo } from "react";
import { HeatmapData } from "../actions";
import React from "react";
import { getCellColor, getEnrollment } from "@/lib/heatmapUtils";

// Define weekdays and hour blocks for the heatmap display
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

interface TimeBlock {
  label: string;
  hour: number;
  minute: number;
  showLabel: boolean;
}

// Create time blocks now with both hour and half-hour increments
const timeBlocks: TimeBlock[] = [];
for (let i = 0; i < 12; i++) {
  const hour = 8 + i;
  const hourLabel = hour <= 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;

  // Add hour block (e.g., 8:00)
  timeBlocks.push({
    label: hourLabel,
    hour: hour,
    minute: 0,
    showLabel: true, // Show label for full hours
  });

  // Add half-hour block (e.g., 8:30)
  timeBlocks.push({
    label: hour <= 12 ? `${hour}:30 AM` : `${hour - 12}:30 PM`,
    hour: hour,
    minute: 30,
    showLabel: false, // Don't show label for half-hours
  });
}

function HeatmapLegend() {
  return (
    <div
      className="flex flex-wrap gap-2 justify-center items-center mt-4"
      aria-label="Legend"
    >
      <div className="flex gap-1 items-center">
        <div className="w-4 h-4 bg-green-600"></div>
        <span className="mr-2 text-sm">Most Available</span>
      </div>

      <div className="flex gap-1 items-center">
        <div className="w-4 h-4 bg-green-400"></div>
        <span className="mr-2 text-sm">Very Available</span>
      </div>

      <div className="flex gap-1 items-center">
        <div className="w-4 h-4 bg-lime-400"></div>
        <span className="mr-2 text-sm">Available</span>
      </div>

      <div className="flex gap-1 items-center">
        <div className="w-4 h-4 bg-yellow-300"></div>
        <span className="mr-2 text-sm">Moderate</span>
      </div>

      <div className="flex gap-1 items-center">
        <div className="w-4 h-4 bg-orange-400"></div>
        <span className="mr-2 text-sm">Busy</span>
      </div>

      <div className="flex gap-1 items-center">
        <div className="w-4 h-4 bg-red-600"></div>
        <span className="text-sm">Very Busy</span>
      </div>
    </div>
  );
}

export default function Heatmap({
  heatmapData,
}: {
  heatmapData: HeatmapData[];
}) {
  // Fix the maxEnrollment calculation to properly handle the data
  const maxEnrollment = useMemo(() => {
    return Math.max(...heatmapData.map((i) => i.enrolled), 1);
  }, [heatmapData]);

  if (heatmapData.length === 0) return null;

  return (
    <div className="overflow-x-auto mt-6 w-full">
      <>
        {/*
        <h2 className="mb-4 text-xl font-semibold text-center">
          {heatmapData && heatmapData.length > 0
            ? `Availability Heatmap for ${selectedMajors.map((m) => m.abbr).join(", ")}`
            : `Availability Heatmap`}
        </h2>
        */}

        <div className="grid gap-1 w-full grid-cols-[auto_repeat(5,1fr)]">
          {/* Empty cell in top-left corner */}
          <div className="p-2"></div>

          {/* Weekday headers */}
          {weekdays.map((day) => (
            <div
              key={day}
              className="p-2 font-medium text-center bg-muted text-muted-foreground"
            >
              {day}
            </div>
          ))}

          {/* Time slots and heatmap cells */}
          {timeBlocks.map((block) => (
            <React.Fragment key={`${block.hour}-${block.minute}`}>
              {/* Time label - only show for full hours */}
              <div
                className={`font-medium p-2 text-right ${block.showLabel ? "" : "text-transparent"}`}
                style={{ height: "40px" }}
              >
                {block.showLabel ? block.label : block.label}
              </div>

              {/* Heatmap cells for this time slot */}
              {weekdays.map((day) => {
                const enrollment = getEnrollment(
                  heatmapData,
                  block.hour,
                  block.minute,
                  day,
                );
                const timeDisplay =
                  block.minute === 0 ? block.label : block.label;

                return (
                  <div
                    key={`${block.hour}-${block.minute}-${day}`}
                    className={`p-2 text-center ${getCellColor(enrollment, maxEnrollment)} transition-colors`}
                    style={{ height: "40px" }}
                    title={`${day} at ${timeDisplay}: ${enrollment} students in class (${Math.round((enrollment / maxEnrollment) * 100)}% of max ${maxEnrollment})`}
                  >
                    {/* Empty cell with no enrollment number */}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        <HeatmapLegend />

        <section
          className="mt-2 text-sm text-center text-gray-600"
          aria-label="Time explanation"
        >
          <p>Each row represents a 30-minute time period</p>
        </section>

        {/* No data message */}
        {/*
        {!errorMessage && (!heatmapData || heatmapData.length === 0) && (
          <div className="p-3 mt-4 text-base text-center text-amber-800 bg-amber-50 rounded-md border border-amber-200">
            No enrollment data found for the selected majors. Try selecting
            different majors.
          </div>
        )}
  )
        */}
      </>
    </div>
  );
}
