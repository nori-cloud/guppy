"use server"
import { profileDB } from "@/db/profile"
import { DashboardPage } from "@/system/route"
import { revalidatePath } from "next/cache"
import { analyticsAPI } from "../analytics/api"
import { db } from "@/db"
import { profiles } from "@/db/schema"
import { usersToProfiles } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function createProfile({
  userId,
  profileName,
}: {
  userId: string
  profileName: string
}) {
  try {
    await db.transaction(async (tx) => {
      console.debug(`Creating profile with name "${profileName}"`)
      const [profile] = await tx
        .insert(profiles)
        .values({ name: profileName })
        .returning()

      await tx.insert(usersToProfiles).values({
        userId: userId,
        profileId: profile.id,
        role: "owner",
      })

      const website = await analyticsAPI.createWebsite({
        name: profile.id,
        domain: `localhost:3000`,
      })
      
      if (!website) {
        throw new Error("Failed to create website on umami for tracking.")
      }

      await tx.update(profiles).set({
        trackingId: website.id,
      }).where(eq(profiles.id, profile.id))

      console.debug(`Profile created with name "${profileName}"`)
    })
  } catch (error) {
    console.debug(`Error creating profile with name "${profileName}"`, error)
  }

  revalidatePath(DashboardPage.Url())
}

export async function validateProfileName(name: string) {
  console.debug(`Validating if profile name "${name}" is available`)
  const profile = await profileDB.getByName(name)
  console.debug(`Profile name "${name}" is ${profile ? "not" : ""} available`)
  return !profile
}

export async function deleteProfile(id: string) {
  console.debug(`Deleting profile with id "${id}"`)
  await profileDB.remove(id)
  console.debug(`Profile deleted with id "${id}"`)

  revalidatePath(DashboardPage.Url())
}
