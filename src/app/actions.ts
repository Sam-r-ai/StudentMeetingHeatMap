"use server";

import { db } from "@/db";
import { majorTable } from "@/db/schema";

export async function getMajors() {
    return db.select().from(majorTable);
}
