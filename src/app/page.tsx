"use client";

import MajorSelection from "@/app/_components/MajorSelection";
import { useState, useTransition, useEffect } from "react";
import type { Major, EnrollmentHeatmap } from "@/db/schema";
import { getHeatmapDataByMajors } from "@/app/actions";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function Page() {
  const [selectedMajors, setSelectedMajors] = useState<Major[]>([]);
  const [heatmapShown, setHeatmapShown] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { data: heatmapData, isFetching } = useQuery({
    queryKey: ["heatmapData", selectedMajors.map(m => m.abbr)],
    queryFn: () => getHeatmapDataByMajors(selectedMajors.map(m => m.abbr)),
    enabled: heatmapShown && selectedMajors.length > 0,
  });

  // Add debugging to see if we're getting data
  useEffect(() => {
    if (heatmapData) {
      console.log("Heatmap data received:", heatmapData);
      if (heatmapData.length > 0) {
        // Debug first timeSlot format
        console.log("First timeSlot format:", heatmapData[0].timeSlot);
      }
    }
  }, [heatmapData]);

  const handleGenerateClick = () => {
    if (selectedMajors.length === 0) {
      alert("Please select at least one major");
      return;
    }
    
    startTransition(() => {
      setHeatmapShown(true);
    });
  };

  // Define weekdays and time slots for the heatmap display
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = 8 + i;
    return hour <= 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;
  });

  // Function to convert display time format to database time format (minutes)
  const convertTimeToMinutes = (timeSlot: string) => {
    const [hour, minutePart] = timeSlot.split(':');
    const [minute, period] = minutePart.split(' ');
    
    let hourNum = parseInt(hour);
    if (period === 'PM' && hourNum !== 12) {
      hourNum += 12;
    } else if (period === 'AM' && hourNum === 12) {
      hourNum = 0;
    }
    
    // Format as database expects: HH:MM:00
    return `${hourNum.toString().padStart(2, '0')}:${minute.padStart(2, '0')}:00`;
  };

  // Get max enrollment count for color scaling
  const maxEnrollment = heatmapData ? Math.max(...heatmapData.map(item => item.totalEnrollment), 1) : 0;

  // Helper to get enrollment for specific time and day
  const getEnrollment = (timeSlot: string, weekday: string) => {
    if (!heatmapData) return 0;
    
    // Convert UI timeSlot to database format
    const dbTimeFormat = convertTimeToMinutes(timeSlot);
    
    const dataPoint = heatmapData.find(
      d => d.timeSlot === dbTimeFormat && d.weekday === weekday
    );
    
    // Debug if first timeSlot of Monday doesn't match
    if (weekday === "Monday" && timeSlot === "8:00 AM" && !dataPoint) {
      console.log("Looking for Monday 8:00 AM as:", dbTimeFormat);
      console.log("Available weekdays:", [...new Set(heatmapData.map(d => d.weekday))]);
      console.log("Available timeSlots:", [...new Set(heatmapData.map(d => d.timeSlot))]);
    }
    
    return dataPoint ? dataPoint.totalEnrollment : 0;
  };

  // Helper to calculate cell color based on availability (inverse of enrollment)
  const getCellColor = (enrollment: number) => {
    if (maxEnrollment === 0) return "bg-green-100"; // Default to green (available) if no data
    
    // Calculate percentage of max enrollment
    const percentage = enrollment / maxEnrollment;
    
    // Reverse the scale: high enrollment = red (busy), low enrollment = green (available)
    if (percentage === 0) return "bg-green-500"; // Completely available
    if (percentage < 0.2) return "bg-green-400";
    if (percentage < 0.4) return "bg-green-300";
    if (percentage < 0.5) return "bg-yellow-300"; // Start transitioning to yellow
    if (percentage < 0.6) return "bg-yellow-400";
    if (percentage < 0.7) return "bg-yellow-500";
    if (percentage < 0.8) return "bg-orange-400"; // Start transitioning to orange/red
    if (percentage < 0.9) return "bg-orange-500";
    return "bg-red-500"; // Very busy time slot
  };

  return (
    <main className="flex justify-center items-center min-h-screen py-10 text-2xl">
      <div className="flex flex-col gap-4 justify-center items-center p-8 rounded-xl border w-full max-w-5xl">
        <p>Select a major!</p>
        <MajorSelection
          selected={selectedMajors}
          setSelected={setSelectedMajors}
          onGenerateClick={handleGenerateClick}
          isGenerating={isPending || isFetching}
        />

        {heatmapShown && (
          <div className="w-full mt-6 overflow-x-auto">
            {isFetching ? (
              <div className="text-center py-10">Loading heatmap data...</div>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-4 text-center">
                  {heatmapData && heatmapData.length > 0 
                    ? `Availability Heatmap for ${selectedMajors.map(m => m.abbr).join(", ")}`
                    : `Availability Heatmap`
                  }
                </h2>
                <div className="grid grid-cols-[auto_repeat(5,1fr)] gap-1 w-full">
                  {/* Empty cell in top-left corner */}
                  <div className="p-2"></div>
                  
                  {/* Weekday headers */}
                  {weekdays.map(day => (
                    <div key={day} className="font-medium text-center p-2 bg-gray-100">
                      {day}
                    </div>
                  ))}
                  
                  {/* Time slots and heatmap cells */}
                  {timeSlots.map(time => (
                    <React.Fragment key={time}>
                      {/* Time label */}
                      <div className="font-medium p-2 text-right">
                        {time}
                      </div>
                      
                      {/* Heatmap cells for this time slot */}
                      {weekdays.map(day => {
                        const enrollment = getEnrollment(time, day);
                        return (
                          <div 
                            key={`${time}-${day}`}
                            className={`p-3 text-center ${getCellColor(enrollment)} transition-colors`}
                            title={`${day} at ${time}: ${enrollment} students enrolled`}
                          >
                            {enrollment > 0 ? enrollment : ""}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
                
                {/* Updated Legend */}
                <div className="mt-4 flex justify-center items-center gap-2">
                  <div className="w-4 h-4 bg-green-500"></div>
                  <span className="text-sm">Most Available</span>
                  <div className="w-4 h-4 bg-yellow-400"></div>
                  <span className="text-sm">Moderate</span>
                  <div className="w-4 h-4 bg-red-500"></div>
                  <span className="text-sm">Busy (Many Students in Class)</span>
                </div>
                
                {/* Error message at the bottom when no data */}
                {(!heatmapData || heatmapData.length === 0) && (
                  <div className="mt-4 p-3 text-center text-amber-800 bg-amber-50 border border-amber-200 rounded-md text-base">
                    No enrollment data found for the selected majors. Try selecting different majors or check database connection.
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
