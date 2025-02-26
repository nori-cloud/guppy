import { eq, inArray, SQL, sql } from "drizzle-orm"
import { db } from "."
import { CreateLinkInput, Link } from "./model"
import { links } from "./schema"

async function create(link: CreateLinkInput) {
  await db.insert(links).values(link)
}

async function update(link: Link) {
  await db
    .update(links)
    .set({ ...link, updatedAt: sql`NOW()` })
    .where(eq(links.id, link.id))
}

async function reorder(newLinks: Link[]) {
  const sqlChunks: SQL[] = [];
  const ids: number[] = [];
  sqlChunks.push(sql`(case`);
  for (const link of newLinks) {
    sqlChunks.push(sql`when ${links.id} = ${link.id} then ${link.order}`);
    ids.push(link.id);
  }
  sqlChunks.push(sql`end)::integer`);
  const finalSql: SQL = sql.join(sqlChunks, sql.raw(' '));
  await db.update(links).set({ order: finalSql }).where(inArray(links.id, ids))
}

export const linkDB = {
  create,
  update,
  updateMany: reorder,
}
