"use server"

import { profileDB } from "@/db/profile"
import { DashboardPage } from "@/system/route"
import { revalidatePath } from "next/cache"

export async function createProfile(name: string) {
  console.debug(`Creating profile with name "${name}"`)
  await profileDB.create({ name })
  console.debug(`Profile created with name "${name}"`)

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
