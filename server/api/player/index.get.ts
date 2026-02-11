import { findPlayers } from "~~/server/db/queries/players";

export default defineEventHandler(async () => {
  return await findPlayers();
});
