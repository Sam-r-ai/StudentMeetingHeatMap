"use server";

import { db } from "@/db";
import { majorTable, enrollmentHeatmapView } from "@/db/schema";
import { inArray } from "drizzle-orm";

// Get list of majors
export async function getMajors() {
  return db.select().from(majorTable);
}

// Get heatmap data filtered by selected major abbreviations
export async function getHeatmapDataByMajors(abbrs: string[]) {
  return db
    .select()
    .from(enrollmentHeatmapView)
    .where(inArray(enrollmentHeatmapView.majorAbbr, abbrs));
}
