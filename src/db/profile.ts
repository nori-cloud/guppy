import { eq } from "drizzle-orm"
import { PgInsertValue } from "drizzle-orm/pg-core"
import { db } from "."
import { profiles, usersToProfiles } from "./schema"
import { getCurrentUser } from "./user"

async function create(data: PgInsertValue<typeof profiles>) {
  const currentUser = await getCurrentUser()

  const profile = await db.insert(profiles).values(data).returning()

  await db.insert(usersToProfiles).values({
    userId: currentUser?.id,
    profileId: profile[0].id,
    role: "owner",
  })
}

async function getById(id: string) {
  const profile = await db.query.profiles.findFirst({
    columns: {
      id: true,
      name: true,
      image: true,
    },
    where: (profiles, { eq }) => eq(profiles.id, id),
    with: {
      links: true,
    },
  })

  return profile
}

async function getByName(name: string) {
  const profile = await db.query.profiles.findFirst({
    where: (profiles, { eq }) => eq(profiles.name, name),
  })

  return profile
}

async function remove(id: string) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    throw new Error("User not found")
  }

  const userToProfile = await db.query.usersToProfiles.findFirst({
    where: (usersToProfiles, { eq }) =>
      eq(usersToProfiles.userId, currentUser.id) &&
      eq(usersToProfiles.role, "owner") &&
      eq(usersToProfiles.profileId, id),
    with: {
      profile: true,
    },
  })

  if (!userToProfile) {
    throw new Error("Profile not found")
  }

  await db.transaction(async (tx) => {
    await tx
      .delete(usersToProfiles)
      .where(
        eq(usersToProfiles.userId, currentUser.id) &&
          eq(usersToProfiles.profileId, id),
      )
    await tx.delete(profiles).where(eq(profiles.id, id))
  })
}

export const profileDB = {
  create,
  getById,
  getByName,
  remove,
}
