import { insertPlayer } from "../../db/queries/players";
import { InsertPlayer } from "../../db/schema";

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, InsertPlayer.safeParse);

  if (!result.success) {
    const statusMessage = result
      .error
      .issues
      .map(issue => `${issue.path.join("")}: ${issue.message}`)
      .join("; ");

    const data = result
      .error
      .issues
      .reduce((errors, issue) => {
        errors[issue.path.join("")] = issue.message;
        return errors;
      }, {} as Record<string, string>);

    return sendError(event, createError({
      statusCode: 422,
      statusMessage,
      data,
    }));
  }

  return insertPlayer(result.data);
});
