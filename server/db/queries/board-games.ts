import { eq } from "drizzle-orm";

import type { InsertBoardGame, UpdateBoardGame } from "../schema";

import db from "..";
import { boardGames } from "../schema";

export async function findBoardGame(slug: string) {
  return await db.query.boardGames.findFirst({
    where: eq(boardGames.slug, slug),
    with: {
      expansions: {
        orderBy: (expansions, { asc }) => [asc(expansions.name)],
      },
    },
  });
}

export async function findBoardGames() {
  return await db.query.boardGames.findMany({
    orderBy: (boardGames, { asc }) => [asc(boardGames.name)],
    with: {
      expansions: {
        orderBy: (expansions, { asc }) => [asc(expansions.name)],
      },
    },
  });
}

export async function updateBoardGame(id: number, insertable: UpdateBoardGame) {
  const [updated] = await db.update(boardGames).set({
    ...insertable,
  }).where(eq(boardGames.id, id)).returning();

  return updated;
}

export async function insertBoardGame(insertable: InsertBoardGame) {
  const [created] = await db.insert(boardGames).values({
    ...insertable,
    played: false,
  }).returning();

  return created;
}

export async function deleteBoardGame(id: number) {
  return await db.delete(boardGames).where(eq(boardGames.id, id)).returning();
}
