import { eq, inArray, SQL, sql } from "drizzle-orm"
import { db } from "."
import { CreateLinkInput, Link, UpdateLinkInput } from "./model"
import { links } from "./schema"

async function create(link: CreateLinkInput) {
  await db.insert(links).values(link)
}

async function update({ id, ...link }: UpdateLinkInput) {
  const { title, url, enabled } = link

  await db
    .update(links)
    .set({
      title,
      url,
      enabled,
      updatedAt: sql`NOW()`
    })
    .where(eq(links.id, id))
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

async function remove(id: number) {
  console.log(`remove link ${id}`)

  const deletedLink = await db.delete(links).where(eq(links.id, id)).returning()

  return deletedLink[0]
}

export const linkDB = {
  create,
  update,
  reorder,
  remove,
}
