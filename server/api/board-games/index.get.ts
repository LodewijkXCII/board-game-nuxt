import { findBoardGames } from "~~/server/db/queries/board-games";

export default defineEventHandler(async () => {
  return await findBoardGames();
});
