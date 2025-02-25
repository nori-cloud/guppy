import { db } from "."
import { CreateLinkInput } from "./model"
import { links } from "./schema"

async function create(link: CreateLinkInput) {
  await db.insert(links).values(link)
}

export const linkDB = {
  create,
}
