import { eq } from "drizzle-orm"
import { db } from "."
import { CreateLinkInput, Link } from "./model"
import { links } from "./schema"

async function create(link: CreateLinkInput) {
  await db.insert(links).values(link)
}

async function update(link: Link) {
  await db
    .update(links)
    .set({ ...link, updatedAt: new Date() })
    .where(eq(links.id, link.id))
}

export const linkDB = {
  create,
  update,
}
