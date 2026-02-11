import type { PgTableWithColumns } from "drizzle-orm/pg-core";

import { eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";

import db from "../db";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 5);

export async function findBoardGameBySlug(slug: string, table: PgTableWithColumns<any>) {
  return db.select().from(table).where(eq(table.slug, slug));
}

export async function findUniqueSlug(slug: string, table: PgTableWithColumns<any>) {
  let existing = !!(await findBoardGameBySlug(slug, table));

  while (existing) {
    const id = nanoid();
    const idSlug = `${slug}-${id}`;
    existing = !!(await findBoardGameBySlug(idSlug, table));
    if (!existing) {
      return idSlug;
    }
  }

  return slug;
}
