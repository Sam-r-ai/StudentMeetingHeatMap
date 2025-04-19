"use server";

import { db } from "@/db";
import {
  majorTable,
  courseTable,
  Major,
  occupancyTable,
  sessionTable,
  weekdayTable,
} from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

// Get list of majors
export async function getMajors() {
  return db.select().from(majorTable);
}

// Get heatmap data filtered by selected major abbreviations
export async function getHeatmapDataByMajors(majors: Major[]) {
  if (majors.length === 0) {
    return [];
  }

  const majorIds = majors.map((m) => m.id);

  return db
    .select()
    .from(occupancyTable)
    .innerJoin(sessionTable, eq(sessionTable.id, occupancyTable.sessionId))
    .innerJoin(courseTable, eq(courseTable.id, sessionTable.courseId))
    .innerJoin(majorTable, eq(majorTable.id, courseTable.majorId))
    .innerJoin(weekdayTable, eq(weekdayTable.id, occupancyTable.weekdayId))
    .where(inArray(majorTable.id, majorIds))
    .groupBy(occupancyTable.time, weekdayTable.id)
    .orderBy(weekdayTable.id, occupancyTable.time);
}

export async function getCoursesByMajor(majors: Major[]) {
  if (majors.length === 0) {
    return [];
  }

  const majorIds = majors.map((m) => m.id);

  return db
    .select()
    .from(majorTable)
    .innerJoin(courseTable, eq(courseTable.majorId, majorTable.id))
    .where(inArray(majorTable.id, majorIds));
}
