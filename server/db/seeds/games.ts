import db from "..";
import { boardGames } from "../schema";
import boardGamesData from "./data/games.json" with { type: "json" };

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function retrieveBestPlayers(bggBestPlayers: string | number): number {
  const parsed = Number.parseInt(bggBestPlayers as string, 10);
  return Number.isNaN(parsed) ? bggBestPlayers.toString().charAt(0).charCodeAt(0) : parsed;
}

export default async function seed() {
  const insertables = await Promise.all(
    boardGamesData.map(async (boardGame) => {
      const slug = generateSlug(boardGame.objectname);

      return {
        name: boardGame.objectname,
        minPlayers: boardGame.minplayers,
        maxPlayers: boardGame.maxplayers,
        bggBestPlayers: retrieveBestPlayers(boardGame.bggbestplayers),
        slug,
      };
    }),
  );

  await db.insert(boardGames).values(insertables);
}
