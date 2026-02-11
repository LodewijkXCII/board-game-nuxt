import { relations } from "drizzle-orm";
import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import type { SelectBoardGameWithExpansions } from "./board-games";
import type { InsertGameSessionPlayers, SelectGameSessionPlayers } from "./game-session-players";

import { boardGames } from "./board-games";
import { boardGameExpansions } from "./board-games-expansions";
import { gameSessionPlayers } from "./game-session-players";
import { player } from "./users";

export const gameSession = pgTable("gameSession", {
  id: serial().primaryKey(),
  boardGameId: integer().notNull().references(() => boardGames.id, { onDelete: "cascade" }),
  expansionId: integer().references(() => boardGameExpansions.id, { onDelete: "cascade" }),
  winnerPlayerId: integer().references(() => player.id, { onDelete: "cascade" }),
  points: integer(),
  playedDate: timestamp().$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
  createdAt: timestamp().$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
  updatedAt: timestamp().$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
});

export const InsertGameSession = createInsertSchema(gameSession, {
  playedDate: () => z.coerce.date(),
  boardGameId: field => field.min(1),
  points: field => field.optional(),
  winnerPlayerId: field => field.optional(),
  expansionId: field => field.optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const gameSessionRelations = relations(gameSession, ({ one, many }) => ({
  boardGame: one(boardGames, {
    fields: [gameSession.boardGameId],
    references: [boardGames.id],
  }),
  players: many(gameSessionPlayers),
}));

export type InsertGameSession = z.infer<typeof InsertGameSession>;

export type SelectGameSession = typeof gameSession.$inferSelect & {
  boardGame: SelectBoardGameWithExpansions;
  players: (SelectGameSessionPlayers & { name?: string })[]; // Add the array brackets []
};

export type InsertGameSessionWithPlayers = z.infer<typeof InsertGameSession> & {
  players: z.infer<typeof InsertGameSessionPlayers>[];
};

export const InsertGameSessionWithPlayersSchema = InsertGameSession.extend({
  players: z.array(
    z.object({
      playerId: z.number(),
      playerPoints: z.number().optional(),
    }),
  ).min(1, "At least one player is required"),
});

export type InsertGameSessionWithPlayersSchema = z.infer<typeof InsertGameSessionWithPlayersSchema>;
