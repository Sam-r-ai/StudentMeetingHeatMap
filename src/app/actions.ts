"use server";

import { db } from "@/db";
import { majorTable, courseTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

// Get list of majors
export async function getMajors() {
  return db.select().from(majorTable);
}

// Get heatmap data filtered by selected major abbreviations
export async function getHeatmapDataByMajors(abbrs: string[]) {
  try {
    if (abbrs.length === 0) {
      return [];
    }

    // Format the array of abbreviations correctly for SQL
    // This properly handles the array for the SQL IN clause
    const formattedAbbrs = abbrs.map(abbr => `'${abbr}'`).join(',');
    
    // Direct query since the view doesn't exist
    const results = await db.execute(sql`
      SELECT
        o."time" as "time",
        w."name" as "name",
        SUM(o."enrollmentTotal") as "total_enrollment"
      FROM
        "Occupancy" o
        JOIN "Session" s ON o."sessionId" = s."id"
        JOIN "Course" c ON s."courseId" = c."id"
        JOIN "Major" m ON c."majorId" = m."id"
        JOIN "Weekday" w ON o."weekdayId" = w."id"
      WHERE
        m."abbr" IN (${sql.raw(formattedAbbrs)})
      GROUP BY
        o."time",
        w."name"
      ORDER BY
        w."name",
        o."time"
    `);
    
    return results;
  } catch (error) {
    console.error("Error fetching heatmap data:", error);
    return [];
  }
}

export async function getCoursesByMajor(majorAbbr: string) {
    return db
        .select()
        .from(majorTable)
        .innerJoin(courseTable, eq(courseTable.majorId, majorTable.id))
        .where(eq(majorTable.abbr, majorAbbr));
}
