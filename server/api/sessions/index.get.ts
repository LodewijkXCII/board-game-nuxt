import { findAllGameSessions } from "~~/server/db/queries/game-session";

export default defineEventHandler(async () => {
  return await findAllGameSessions();
});
