import { deleteBoardGame } from "~~/server/db/queries/board-games";
import { validId } from "~~/server/lib/zod-schema";

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, data => validId.safeParse(data));

  if (!params.success) {
    throw createError({
      statusCode: 404,
      statusMessage: "Spel niet gevonden",
    });
  }

  try {
    return await deleteBoardGame(params.data.id);
  }
  catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: `Database Deletion Failed: ${e}`,
    });
  }
});
