import type { z } from "zod";

import { relations } from "drizzle-orm";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

import { gameSessionPlayers } from "./game-session-players";

export const player = pgTable("player", {
  id: serial().primaryKey(),
  name: text().notNull(),
  createdAt: timestamp().$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
  updatedAt: timestamp().$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
});

export const playerRalations = relations(player, ({ many }) => ({
  gameSessionPlayers: many(gameSessionPlayers),
}));

export const InsertPlayer = createInsertSchema(player, {
  name: field => field.min(1).max(100),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdatePlayer = createUpdateSchema(player).omit({
  createdAt: true,
  updatedAt: true,
});

export type SelectPlayer = typeof player.$inferSelect;
export type SelectPlayerWithRelations = SelectPlayer & {
  gameSessionPlayers: typeof gameSessionPlayers.$inferSelect[];
};
export type InsertPlayer = z.infer<typeof InsertPlayer>;
export type UpdatePlayer = z.infer<typeof UpdatePlayer>;
