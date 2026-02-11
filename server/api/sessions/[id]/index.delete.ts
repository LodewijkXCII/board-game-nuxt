import { deleteSession } from "~~/server/db/queries/game-session";
import { validId } from "~~/server/lib/zod-schema";

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, data => validId.safeParse(data));

  if (!params.success) {
    throw createError({
      statusCode: 404,
      statusMessage: "Sessie niet gevonden",
    });
  }

  try {
    return await deleteSession(params.data.id);
  }
  catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: `Database Deletion Failed: ${e}`,
    });
  }
});
