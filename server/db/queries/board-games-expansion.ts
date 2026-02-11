import type { InsertBoardGameExpansion } from "../schema";

import db from "..";
import { boardGameExpansions } from "../schema";

export async function insertBoardGameExpansion(insertable: InsertBoardGameExpansion, id: number) {
  const [inserted] = await db.insert(boardGameExpansions).values({
    ...insertable,
    boardGameId: id,
    played: false,
  }).returning();

  return inserted;
}
