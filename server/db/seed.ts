// import type { Table } from "drizzle-orm";

import seed from "./seeds/games";

// import { getTableName, sql } from "drizzle-orm";

// import { db } from "../db";
// import * as schema from "./schema";
// import seed from "./seeds/games";

// async function resetTable(db: db, table: Table) {
//   return db.execute(
//     sql.raw(`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`),
//   );
// }

// for (const table of [
//   schema.boardGames,
// ]) {
//   await resetTable(db, table);
// }

await seed();
