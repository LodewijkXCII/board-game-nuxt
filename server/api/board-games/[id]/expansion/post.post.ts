import { insertBoardGameExpansion } from "~~/server/db/queries/board-games-expansion";
import { boardGames, InsertBoardGameExpansion } from "~~/server/db/schema";
import { validId } from "~~/server/lib/zod-schema";
import { isValidToTable } from "~~/server/utils/valid-to-table";

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, body => InsertBoardGameExpansion.safeParse(body));
  const params = await getValidatedRouterParams(event, data => validId.safeParse(data));

  if (!params.data?.id) {
    throw createError({
      statusCode: 500,
      statusMessage: "No Id Provided",
    });
  }

  const isValidBoardGame = isValidToTable(boardGames, params.data.id);

  if (!isValidBoardGame) {
    throw createError({
      statusCode: 404,
      statusMessage: "Board Game Not Found",
    });
  }

  if (!result.success) {
    // Map Zod errors to a format Vee-Validate understands (path: message)
    const data = result.error.issues.reduce((errors, issue) => {
      errors[issue.path.join(".")] = issue.message;
      return errors;
    }, {} as Record<string, string>);

    throw createError({
      statusCode: 422,
      statusMessage: "Validation Failed",
      data,
    });
  }

  try {
    return await insertBoardGameExpansion(result.data, params.data.id);
  }
  catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: `Database Insertion Failed: ${e}`,
    });
  }
});
