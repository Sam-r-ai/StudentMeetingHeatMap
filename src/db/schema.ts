import { InferSelectModel } from "drizzle-orm";
import { AnyPgColumn, integer, pgEnum, pgTable, bigserial, text, time, char, serial } from "drizzle-orm/pg-core";

export const instructionModeEnum = pgEnum("instructionMode", ["virtual", "inperson"])

export const courseTable = pgTable("Course", {
    id: serial().primaryKey().notNull(),
    majorId: integer().references((): AnyPgColumn => majorTable.id).notNull(),
    catalogNumber: text().notNull(),
})

export const majorTable = pgTable("Major", {
    id: serial().primaryKey().notNull(),
    abbr: text().notNull(),
    name: text().notNull(),
})

export const termTable = pgTable("Term", {
    id: integer().primaryKey().notNull(),
    dscr: text(),
})

export const sessionTable = pgTable("Session", {
    id: bigserial({ mode: 'number' }).primaryKey().notNull(),
    courseId: integer().references((): AnyPgColumn => courseTable.id).notNull(),
    termId: integer().references((): AnyPgColumn => termTable.id).notNull(),
    sectionCode: integer().notNull(),
    instructionMode: char({ length: 1 }).notNull(),
});

export const occupancyTable = pgTable("Occupancy", {
    id: bigserial({ mode: 'number' }).primaryKey().notNull(),
    sessionId: integer().references((): AnyPgColumn => sessionTable.id).notNull(),
    time: time().notNull(),
    weekdayId: integer().references((): AnyPgColumn => weekdayTable.id).notNull(),
    enrollmentTotal: integer().notNull(),
});


export const weekdayTable = pgTable("Weekday", {
    id: integer().primaryKey().notNull(),
    name: text().notNull(),
    abbr: text().notNull(),
});

export type Major = InferSelectModel<typeof majorTable>;
export type Course = InferSelectModel<typeof courseTable>;
export type Term = InferSelectModel<typeof termTable>;
export type Session = InferSelectModel<typeof sessionTable>;
export type Occupancy = InferSelectModel<typeof occupancyTable>;
export type Weekday = InferSelectModel<typeof weekdayTable>;


export const enrollmentHeatmapView = pgTable("enrollment_heatmap_view", {
    timeSlot: text("time_slot"),
    weekday: text("weekday"),
    majorAbbr: text("major_abbr"),
    totalEnrollment: integer("total_enrollment"),
  });
  
  export type EnrollmentHeatmap = InferSelectModel<typeof enrollmentHeatmapView>;
  