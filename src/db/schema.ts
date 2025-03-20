import { AnyPgColumn, integer, pgEnum, pgSchema, text, time } from "drizzle-orm/pg-core";

export const heatmapSchema = pgSchema("heatmap")

export const instructionModeEnum = pgEnum("instructionMode", ["virtual", "inperson"])

export const majorTable = heatmapSchema.table("Major", {
    id: integer().primaryKey(),
    name: text(),
})

export const courseTable = heatmapSchema.table("Course", {
    id: integer().primaryKey(),
    majorId: integer().references((): AnyPgColumn => majorTable.id),
})

export const termTable = heatmapSchema.table("Term", {
    id: integer().primaryKey(),
    name: text(),
})

export const weekdayTable = heatmapSchema.table("Weekday", {
    id: integer().primaryKey(),
    name: text(),
});

export const timeSlotTable = heatmapSchema.table("TimeSlot", {
    id: integer().primaryKey(),
    time: time(),
});

export const sessionTable = heatmapSchema.table("Session", {
    id: integer().primaryKey(),
    courseId: integer().references((): AnyPgColumn => courseTable.id),
    termId: integer().references((): AnyPgColumn => termTable.id),
    name: text(),
    instructionMode: instructionModeEnum(),
});

export const occupancyTable = heatmapSchema.table("Occupancy", {
    id: integer().primaryKey(),
    sessionId: integer().references((): AnyPgColumn => sessionTable.id),
    weekdayId: integer().references((): AnyPgColumn => weekdayTable.id),
    timeSlotId: integer().references((): AnyPgColumn => timeSlotTable.id),
    studentCount: integer(),
});
