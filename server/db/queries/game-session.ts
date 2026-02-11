import { eq } from "drizzle-orm";

import type { InsertGameSessionWithPlayersSchema } from "../schema";

import db from "..";
import { boardGames, gameSession, gameSessionPlayers } from "../schema";

export async function insertGameSession(
  data: InsertGameSessionWithPlayersSchema,
) {
  return await db.transaction(async (tx) => {
    const [session] = await tx.insert(gameSession).values({
      boardGameId: data.boardGameId,
      playedDate: data.playedDate,
      winnerPlayerId: data.winnerPlayerId,
      points: data.points,
      expansionId: data.expansionId,
    }).returning({ id: gameSession.id });

    if (!session) {
      return;
    }

    const playersToInsert = data.players.map(p => ({
      ...p,
      gameSessionId: session.id,
      playerPoints: p.playerPoints ?? null,
    }));

    await tx.insert(gameSessionPlayers).values(playersToInsert);

    const [isPlayed] = await tx.select({ played: boardGames.played }).from(boardGames).where(
      eq(boardGames.id, data.boardGameId),
    ).limit(1);

    if (isPlayed && !isPlayed.played) {
      await tx.update(boardGames)
        .set({ played: true })
        .where(eq(boardGames.id, data.boardGameId));
    }

    return session;
  });
}

export async function findAllGameSessions() {
  return await db.query.gameSession.findMany({
    with: {
      boardGame: {
        with: {
          expansions: true,
        },
      },
      players: {
        with: {
          player: true,
        },
      },
    },
  });
}

export async function deleteSession(id: number) {
  return await db.delete(gameSession).where(eq(gameSession.id, id)).returning();
}
