import { AnyPgColumn, integer, pgEnum, pgTable, bigserial, text, time, char, serial } from "drizzle-orm/pg-core";

export const instructionModeEnum = pgEnum("instructionMode", ["virtual", "inperson"])

export const courseTable = pgTable("Course", {
    id: serial().primaryKey(),
    majorId: integer().references((): AnyPgColumn => majorTable.id),
    catalogNumber: text(),
})

export const majorTable = pgTable("Major", {
    id: serial().primaryKey(),
    abbr: text(),
    name: text(),
})

export const termTable = pgTable("Term", {
    id: integer().primaryKey(),
    dscr: text(),
})

export const sessionTable = pgTable("Session", {
    id: bigserial({ mode: 'number' }).primaryKey(),
    courseId: integer().references((): AnyPgColumn => courseTable.id),
    termId: integer().references((): AnyPgColumn => termTable.id),
    sectionCode: integer(),
    instructionMode: char({ length: 1 }),
});

export const occupancyTable = pgTable("Occupancy", {
    id: bigserial({ mode: 'number' }).primaryKey(),
    sessionId: integer().references((): AnyPgColumn => sessionTable.id),
    time: time(),
    weekdayId: integer().references((): AnyPgColumn => weekdayTable.id),
    enrollmentTotal: integer(),
});


export const weekdayTable = pgTable("Weekday", {
    id: integer().primaryKey(),
    name: text(),
    abbr: text(),
});
