import { eq, sql } from "drizzle-orm"
import { PgInsertValue } from "drizzle-orm/pg-core"
import { db } from "."
import { UpdateProfileInput } from "./model"
import { profiles, usersToProfiles } from "./schema"
import { getCurrentUser } from "./user"

async function create(data: PgInsertValue<typeof profiles>) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    // fix this later
    throw new Error("User not found")
  }

  const profile = await db.insert(profiles).values(data).returning()

  await db.insert(usersToProfiles).values({
    userId: currentUser.id,
    profileId: profile[0].id,
    role: "owner",
  })
}

async function getById(id: string) {
  const profile = await db.query.profiles.findFirst({
    where: (profiles, { eq }) => eq(profiles.id, id),
    with: {
      links: {
        orderBy: (links, { asc }) => asc(links.order),
      },
    },
  })

  return profile
}

async function getByName(name: string) {
  const profile = await db.query.profiles.findFirst({
    where: (profiles, { eq }) => eq(profiles.name, name),
    with: {
      links: {
        orderBy: (links, { asc }) => asc(links.order),
      },
    },
  })

  return profile
}

async function update(profile: UpdateProfileInput) {
  await db.update(profiles).set({
    ...profile,
    updatedAt: sql`NOW()`
  }).where(eq(profiles.id, profile.id))
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
  update,
  remove,
}
