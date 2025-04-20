import { HeatmapData } from "@/app/actions";

// Helper to calculate cell color based on availability (inverse of enrollment)
export function getCellColor(enrollment: number, maxEnrollment: number) {
  if (maxEnrollment === 0) return "bg-green-100"; // Default to green (available) if no data

  // Make sure enrollment is a valid number
  const safeEnrollment =
    typeof enrollment === "number" && isFinite(enrollment) ? enrollment : 0;

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
}

// Helper to get enrollment for a specific time block and day
export function getEnrollment(
  heatmapData: HeatmapData[],
  hour: number,
  minute: number,
  weekday: string,
) {
  if (!heatmapData || heatmapData.length === 0) return 0;

  // Filter records for this time and weekday
  const timeRecords = heatmapData.filter((data) => {
    try {
      const timeString = String(data.time);
      const [hourStr, minuteStr] = timeString.split(":");
      const recordHour = Number.parseInt(hourStr);
      const recordMinute = Number.parseInt(minuteStr);

      // Match records in the 30-minute window
      // For XX:00 cells, match XX:00 to XX:29
      // For XX:30 cells, match XX:30 to XX:59
      const minuteMatches =
        minute === 0
          ? recordMinute >= 0 && recordMinute < 30
          : recordMinute >= 30 && recordMinute < 60;

      return recordHour === hour && minuteMatches && data.weekday === weekday;
    } catch (err) {
      console.error("Error parsing time:", data.time, err);
      return false;
    }
  });

  if (timeRecords.length === 0) return 0;

  // Calculate average enrollment for this time block
  const totalEnrollment = timeRecords.reduce((sum, data) => {
    return sum + data.enrolled;
  }, 0);

  return Math.round(totalEnrollment / timeRecords.length);
}
