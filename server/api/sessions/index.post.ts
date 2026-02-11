import { insertGameSession } from "~~/server/db/queries/game-session";
import { InsertGameSessionWithPlayersSchema } from "~~/server/db/schema";
import { createError, readValidatedBody } from "h3";

export default defineEventHandler(async (event) => {
  // 1. Read and validate the body using your Zod schema
  const result = await readValidatedBody(event, body =>
    InsertGameSessionWithPlayersSchema.safeParse(body));

  // 2. Handle validation errors
  if (!result.success) {
    throw createError({
      statusCode: 422,
      statusMessage: "Validation Error",
      data: result.error.format(), // Provides a structured error object
    });
  }

  // 3. Call your query with the validated data
  // Assuming result.data matches your DB structure
  return await insertGameSession(result.data);
});
