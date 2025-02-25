"use server"
import { linkDB } from "@/db/link"
import { CreateLinkInput } from "@/db/model"
import { profileDB } from "@/db/profile"

export async function getProfileById(id: string) {
  const profile = await profileDB.getById(id)

  if (!profile) {
    throw new Error("Profile not found")
  }

  return profile
}

export async function createLink(link: CreateLinkInput) {
  await linkDB.create(link)
}
