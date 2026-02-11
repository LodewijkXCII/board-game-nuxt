import type { z } from "zod";

import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

import type { SelectBoardGameExpansion } from "./board-games-expansions";

import { boardGameExpansions } from "./board-games-expansions";
import { gameSession } from "./game-session";

export const boardGames = pgTable("boardGames", {
  id: serial().primaryKey(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  bbgId: integer(),
  minPlayers: integer().notNull(),
  maxPlayers: integer().notNull(),
  bggBestPlayers: integer().notNull(),
  played: boolean().$default(() => false).notNull(),
  createdAt: timestamp().$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: timestamp().$defaultFn(() => /* @__PURE__ */ new Date()).$onUpdate(() => new Date()),
});

export const InsertBoardGame = createInsertSchema(boardGames, {
  name: field => field.min(1).max(100),
  minPlayers: field => field.min(1).max(99),
  maxPlayers: field => field.min(1).max(99),
  bggBestPlayers: field => field.min(1).max(99),
  slug: field => field.min(1),
}).omit({
  id: true,
  bbgId: true,
  played: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateBoardGame = createUpdateSchema(boardGames).omit({ createdAt: true, updatedAt: true });

export const boardGameRelations = relations(boardGames, ({ many }) => ({
  expansions: many(boardGameExpansions),
  gameSession: many(gameSession),
}));

export type InsertBoardGame = z.infer<typeof InsertBoardGame>;
export type SelectBoardGame = typeof boardGames.$inferSelect;
export type SelectGameSessions = typeof boardGames.$inferSelect;
export type SelectBoardGameWithExpansions = SelectBoardGame & {
  expansions: SelectBoardGameExpansion[];
};
export type UpdateBoardGame = z.infer<typeof UpdateBoardGame>;
