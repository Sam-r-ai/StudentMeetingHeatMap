"use client";

import MajorSelection from "@/app/_components/MajorSelection";
import { useState, useTransition, useEffect, useMemo } from "react";
import type { Major } from "@/db/schema";
import { getHeatmapDataByMajors } from "@/app/actions";
import { useQuery } from "@tanstack/react-query";
import React from "react";

// Define the data structure to match the actual response
type HeatmapDataPoint = {
  time: string;
  name: string;
  total_enrollment: number;
};

export default function Page() {
  const [selectedMajors, setSelectedMajors] = useState<Major[]>([]);
  const [heatmapShown, setHeatmapShown] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: heatmapData, isFetching } = useQuery<HeatmapDataPoint[]>({
    queryKey: ["heatmapData", selectedMajors.map(m => m.abbr)],
    queryFn: async () => {
      try {
        return await getHeatmapDataByMajors(selectedMajors.map(m => m.abbr));
      } catch (err) {
        console.error("Error fetching heatmap data:", err);
        setErrorMessage(err instanceof Error ? err.message : "Failed to fetch data");
        return [];
      }
    },
    enabled: heatmapShown && selectedMajors.length > 0,
  });

  useEffect(() => {
    if (heatmapData && heatmapData.length > 0) {
      console.log("First time format:", heatmapData[0].time);
    }
  }, [heatmapData]);

  const handleGenerateClick = () => {
    if (selectedMajors.length === 0) {
      alert("Please select at least one major");
      return;
    }
    
    setErrorMessage(null);
    startTransition(() => {
      setHeatmapShown(true);
    });
  };

  // Define weekdays and hour blocks for the heatmap display
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  
  // Create time blocks now with both hour and half-hour increments
  const timeBlocks = [];
  for (let i = 0; i < 12; i++) {
    const hour = 8 + i;
    const hourLabel = hour <= 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;
    
    // Add hour block (e.g., 8:00)
    timeBlocks.push({
      display: hourLabel,
      hour: hour,
      minute: 0,
      showLabel: true // Show label for full hours
    });
    
    // Add half-hour block (e.g., 8:30)
    timeBlocks.push({
      display: hour <= 12 ? `${hour}:30 AM` : `${hour - 12}:30 PM`,
      hour: hour,
      minute: 30,
      showLabel: false // Don't show label for half-hours
    });
  }

  // Fix the maxEnrollment calculation to properly handle the data
  const maxEnrollment = useMemo(() => {
    if (!heatmapData || heatmapData.length === 0) return 0;
    
    const validEnrollments = heatmapData
      .map(item => {
        if (typeof item.total_enrollment === 'number') {
          return item.total_enrollment;
        }
        const parsed = parseInt(String(item.total_enrollment));
        return isNaN(parsed) ? 0 : parsed;
      })
      .filter(value => !isNaN(value) && isFinite(value));
    
    return validEnrollments.length > 0 ? Math.max(...validEnrollments, 1) : 1;
  }, [heatmapData]);

  // Helper to get enrollment for a specific time block and day
  const getEnrollment = (hour: number, minute: number, weekday: string) => {
    if (!heatmapData || heatmapData.length === 0) return 0;
    
    // Filter records for this time and weekday
    const timeRecords = heatmapData.filter(d => {
      try {
        const timeString = String(d.time);
        const [hourStr, minuteStr] = timeString.split(':');
        const recordHour = parseInt(hourStr);
        const recordMinute = parseInt(minuteStr);
        
        // Match records in the 30-minute window
        // For XX:00 cells, match XX:00 to XX:29
        // For XX:30 cells, match XX:30 to XX:59
        const minuteMatches = minute === 0 
          ? (recordMinute >= 0 && recordMinute < 30)
          : (recordMinute >= 30 && recordMinute < 60);
          
        return recordHour === hour && minuteMatches && d.name === weekday;
      } catch (err) {
        console.error("Error parsing time:", d.time, err);
        return false;
      }
    });
    
    if (timeRecords.length === 0) return 0;
    
    // Calculate average enrollment for this time block
    const totalEnrollment = timeRecords.reduce((sum, record) => {
      const enrollment = typeof record.total_enrollment === 'number' 
        ? record.total_enrollment 
        : parseInt(String(record.total_enrollment)) || 0;
      
      return sum + enrollment;
    }, 0);
    
    return Math.round(totalEnrollment / timeRecords.length);
  };

  // Helper to calculate cell color based on availability (inverse of enrollment)
  const getCellColor = (enrollment: number) => {
    if (maxEnrollment === 0) return "bg-green-100"; // Default to green (available) if no data
    
    // Make sure enrollment is a valid number
    const safeEnrollment = typeof enrollment === 'number' && isFinite(enrollment) 
      ? enrollment 
      : 0;
    
    // Calculate percentage of max enrollment, with safety checks
    const percentage = maxEnrollment > 0 ? safeEnrollment / maxEnrollment : 0;

    // More granular color scale with smoother transitions
    // From green (most available) to red (most busy)
    if (percentage === 0) return "bg-green-600"; // Completely available
    if (percentage < 0.1) return "bg-green-500";
    if (percentage < 0.2) return "bg-green-400";
    if (percentage < 0.3) return "bg-green-300";
    if (percentage < 0.4) return "bg-lime-400"; // Start transitioning to light green/lime
    if (percentage < 0.5) return "bg-lime-300";
    if (percentage < 0.55) return "bg-yellow-200"; // Light yellow
    if (percentage < 0.6) return "bg-yellow-300";
    if (percentage < 0.65) return "bg-yellow-400"; // Yellow
    if (percentage < 0.7) return "bg-yellow-500";
    if (percentage < 0.75) return "bg-amber-500"; // Start transitioning to orange/amber
    if (percentage < 0.8) return "bg-orange-400";
    if (percentage < 0.85) return "bg-orange-500";
    if (percentage < 0.9) return "bg-red-400"; // Light red
    if (percentage < 0.95) return "bg-red-500";
    return "bg-red-600"; // Deep red (very busy)
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

                {/* Database error message when there's an error */}
                {errorMessage && (
                  <div className="mb-4 p-3 text-center text-red-800 bg-red-50 border border-red-200 rounded-md text-base">
                    <p className="font-semibold">Database Error</p>
                    <p>{errorMessage}</p>
                  </div>
                )}
                
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
                  {timeBlocks.map((block) => (
                    <React.Fragment key={`${block.hour}-${block.minute}`}>
                      {/* Time label - only show for full hours */}
                      <div 
                        className={`font-medium p-2 text-right ${block.showLabel ? '' : 'text-transparent'}`}
                        style={{ height: '40px' }}
                      >
                        {block.showLabel ? block.display : block.display}
                      </div>
                      
                      {/* Heatmap cells for this time slot */}
                      {weekdays.map(day => {
                        const enrollment = getEnrollment(block.hour, block.minute, day);
                        const timeDisplay = block.minute === 0 
                          ? block.display
                          : block.display;
                          
                        return (
                          <div 
                            key={`${block.hour}-${block.minute}-${day}`}
                            className={`p-2 text-center ${getCellColor(enrollment)} transition-colors`}
                            style={{ height: '40px' }}
                            title={`${day} at ${timeDisplay}: ${enrollment} students in class (${Math.round((enrollment/maxEnrollment)*100)}% of max ${maxEnrollment})`}
                          >
                            {/* Empty cell with no enrollment number */}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
                
                {/* Updated Legend with more gradual transitions */}
                <div className="mt-4 flex flex-wrap justify-center items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-green-600"></div>
                    <span className="text-sm mr-2">Most Available</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-green-400"></div>
                    <span className="text-sm mr-2">Very Available</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-lime-400"></div>
                    <span className="text-sm mr-2">Available</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-yellow-300"></div>
                    <span className="text-sm mr-2">Moderate</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-orange-400"></div>
                    <span className="text-sm mr-2">Busy</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-red-600"></div>
                    <span className="text-sm">Very Busy</span>
                  </div>
                </div>
                
                {/* Time explanation */}
                <div className="mt-2 text-sm text-gray-600 text-center">
                  <p>Each row represents a 30-minute time period</p>
                </div>
                
                {/* No data message */}
                {(!errorMessage && (!heatmapData || heatmapData.length === 0)) && (
                  <div className="mt-4 p-3 text-center text-amber-800 bg-amber-50 border border-amber-200 rounded-md text-base">
                    No enrollment data found for the selected majors. Try selecting different majors.
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
