import type { PgTableWithColumns } from "drizzle-orm/pg-core";

import { eq } from "drizzle-orm";

import db from "../db";

export async function isValidToTable(table: PgTableWithColumns<any>, id: number | string): Promise<boolean> {
  try {
    const [result] = await db.select().from(table).where(eq(table.id, id));

    return !!result?.id;
  }
  catch (error) {
    console.error("Error validating: ", error);
    return false;
  }
}
