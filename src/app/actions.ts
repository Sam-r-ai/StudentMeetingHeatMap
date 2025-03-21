"use server";

import { db } from "@/db";
import { majorTable } from "@/db/schema";

export async function getMajors() {
    return await db.select().from(majorTable);
}
