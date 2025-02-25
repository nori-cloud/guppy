"use server"

import { db } from "@/db"
import { profiles, usersToProfiles } from "@/db/schema"
import { getCurrentUser } from "@/db/user"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { DashboardRoute } from "./route"

export async function createProfile(name: string) {
  const currentUser = await getCurrentUser()

  const profile = await db.insert(profiles).values({ name }).returning()

  await db.insert(usersToProfiles).values({
    userId: currentUser?.id,
    profileId: profile[0].id,
    role: "owner",
  })

  revalidatePath(DashboardRoute.Index.Url)
}

export async function validateProfileName(name: string) {
  const profile = await db.query.profiles.findFirst({
    where: (profiles, { eq }) => eq(profiles.name, name),
  })

  if (profile) {
    return false
  }

  return true
}

export async function deleteProfile(id: string) {
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

  revalidatePath(DashboardRoute.Index.Url)
}
