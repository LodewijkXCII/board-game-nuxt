import type { z } from "zod/v4";

import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { boardGames } from "./board-games";

export const boardGameExpansions = pgTable("boardGamesExpansions", {
  id: serial().primaryKey(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  boardGameId: integer().notNull().references(() => boardGames.id, { onDelete: "cascade" }),
  bbgid: integer(),
  minPlayers: integer().notNull(),
  maxPlayers: integer().notNull(),
  bggBestPlayers: integer().notNull(),
  played: boolean().$default(() => false).notNull(),
  createdAt: timestamp().$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: timestamp().$defaultFn(() => /* @__PURE__ */ new Date()).$onUpdate(() => new Date()),
});

export const InsertBoardGameExpansion = createInsertSchema(boardGameExpansions, {
  name: field => field.min(1).max(1000),
  minPlayers: field => field.int().positive().max(99),
  maxPlayers: field => field.int().positive().max(99),
  bggBestPlayers: field => field.int().positive().max(99),
  slug: field => field.min(1),
}).omit({
  id: true,
  bbgid: true,
  played: true,
  boardGameId: true,
  createdAt: true,
  updatedAt: true,
});

export const boardGameExpansionsRelations = relations(boardGameExpansions, ({ one }) => ({
  boardGame: one(boardGames, {
    fields: [boardGameExpansions.boardGameId],
    references: [boardGames.id],
  }),
}));

export type InsertBoardGameExpansion = z.infer<typeof InsertBoardGameExpansion>;
export type SelectBoardGameExpansion = typeof boardGameExpansions.$inferSelect;
