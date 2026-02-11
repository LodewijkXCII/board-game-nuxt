import { insertBoardGame } from "~~/server/db/queries/board-games";
import { InsertBoardGame } from "~~/server/db/schema";

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, body => InsertBoardGame.safeParse(body));

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
    return await insertBoardGame(result.data);
  }
  catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: `Database Insertion Failed: ${e}`,
    });
  }
});
