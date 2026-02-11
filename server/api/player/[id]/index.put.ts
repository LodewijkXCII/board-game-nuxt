import { updatePlayer } from "~~/server/db/queries/players";
import { UpdatePlayer } from "~~/server/db/schema";
import { validId } from "~~/server/lib/zod-schema";

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, body => UpdatePlayer.safeParse(body));
  const params = await getValidatedRouterParams(event, data => validId.safeParse(data));

  if (!params.success) {
    throw createError({
      statusCode: 404,
      statusMessage: "Speler niet gevonden",
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
    return await updatePlayer(params.data.id, result.data);
  }
  catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: `Database Insertion Failed: ${e}`,
    });
  }
});
