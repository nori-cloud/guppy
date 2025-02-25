import { PgInsertValue } from "drizzle-orm/pg-core"
import { db } from "."
import { profiles, usersToProfiles } from "./schema"
import { getCurrentUser } from "./user"

export async function createProfile(data: PgInsertValue<typeof profiles>) {
  const currentUser = await getCurrentUser()

  const profile = await db.insert(profiles).values(data).returning()

  await db.insert(usersToProfiles).values({
    userId: currentUser?.id,
    profileId: profile[0].id,
    role: "owner",
  })
}

export async function getProfile(id: string) {
  const profile = await db.query.profiles.findFirst({
    columns: {
      id: true,
      name: true,
      image: true,
    },
    where: (profiles, { eq }) => eq(profiles.id, id),
  })

  return profile
}
