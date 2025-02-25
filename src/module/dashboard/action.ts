"use server"

import { profileDB } from "@/db/profile"
import { revalidatePath } from "next/cache"
import { DashboardPage } from "./route"

export async function createProfile(name: string) {
  await profileDB.create({ name })
  revalidatePath(DashboardPage.Url)
}

export async function validateProfileName(name: string) {
  const profile = await profileDB.getByName(name)
  return !profile
}

export async function deleteProfile(id: string) {
  await profileDB.remove(id)

  revalidatePath(DashboardPage.Url)
}
