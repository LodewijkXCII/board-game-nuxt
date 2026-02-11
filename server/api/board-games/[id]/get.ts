import { findBoardGame } from "~~/server/db/queries/board-games";

export default defineEventHandler(async (event) => {
  const searchSlug = getRouterParam(event, "slug") as string;

  const boardGame = await findBoardGame(searchSlug);

  if (!boardGame) {
    throw createError({
      statusCode: 404,
      statusMessage: "Spel niet gevonden",
    });
  }

  return boardGame;
});
