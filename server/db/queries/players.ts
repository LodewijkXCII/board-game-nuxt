import { eq } from "drizzle-orm";

import type { InsertPlayer, UpdatePlayer } from "../schema";

import db from "..";
import { player } from "../schema";

export async function findPlayers() {
  const players = await db.query.player.findMany({
    orderBy: (player, { asc }) => [asc(player.name)],
    with: {
      gameSessionPlayers: {
        with: {
          gameSession: {
            with: {
              boardGame: true,
            },
          },
        },
      },
    },
  });

  return players.map(p => ({
    ...p,
    sessions: p.gameSessionPlayers.map(gsp => ({
      id: gsp.gameSession.id,
      gameName: gsp.gameSession.boardGame.name,
      playerPoints: gsp.playerPoints,
      isWinner: gsp.gameSession.winnerPlayerId === p.id,
      date: gsp.gameSession.playedDate,
    })),
  }));
}

export async function insertPlayer(insertable: InsertPlayer) {
  const [created] = await db.insert(player).values({
    ...insertable,
  }).returning();

  return created;
}

export async function updatePlayer(id: number, insertable: UpdatePlayer) {
  const [updated] = await db
    .update(player)
    .set(insertable)
    .where(eq(player.id, id))
    .returning();

  return updated;
}

export async function deletePlayer(id: number) {
  return await db.delete(player).where(eq(player.id, id)).returning();
}
