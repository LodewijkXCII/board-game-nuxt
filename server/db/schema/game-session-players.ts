import type z from "zod/v4";

import { relations } from "drizzle-orm";
import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import type { SelectPlayer } from "./users";

import { gameSession } from "./game-session";
import { player } from "./users";

export const gameSessionPlayers = pgTable("gameSessionPlayers", {
  id: serial().primaryKey(),
  gameSessionId: integer().notNull().references(() => gameSession.id, { onDelete: "cascade" }),
  playerId: integer().notNull().references(() => player.id, { onDelete: "cascade" }),
  playerPoints: integer(),
  createdAt: timestamp().$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: timestamp().$defaultFn(() => /* @__PURE__ */ new Date()).$onUpdate(() => new Date()),
});

export const InsertGameSessionPlayers = createInsertSchema(gameSessionPlayers, {
  gameSessionId: field => field.min(1),
  playerId: field => field,
}).omit({
  id: true,
  playerPoints: true,
  createdAt: true,
  updatedAt: true,
});

export const gameSessionPlayersRelations = relations(gameSessionPlayers, ({ one }) => ({
  player: one(player, {
    fields: [gameSessionPlayers.playerId],
    references: [player.id],
  }),
  gameSession: one(gameSession, {
    fields: [gameSessionPlayers.gameSessionId],
    references: [gameSession.id],
  }),
}));

export type InsertGameSessionPlayers = z.infer<typeof InsertGameSessionPlayers>;
export type SelectGameSessionPlayers = typeof gameSessionPlayers.$inferSelect & {
  player: SelectPlayer;
};
