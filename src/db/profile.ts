import { PgInsertValue } from "drizzle-orm/pg-core"
import { db } from "."
import { profiles, usersToProfiles } from "./schema"

export async function createProfile(
  userId: string,
  data: PgInsertValue<typeof profiles>,
) {
  const profile = await db.insert(profiles).values(data).returning()

  await db.insert(usersToProfiles).values({
    userId,
    profileId: profile[0].id,
    role: "owner",
  })
}
