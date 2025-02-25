"use server"
import { profileDB } from "@/db/profile"

export async function getProfileById(id: string) {
  const profile = await profileDB.getById(id)

  if (!profile) {
    throw new Error("Profile not found")
  }

  return profile
}
