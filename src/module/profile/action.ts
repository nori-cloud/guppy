"use server"
import { linkDB } from "@/db/link"
import { CreateLinkInput, Link } from "@/db/model"
import { profileDB } from "@/db/profile"
import { revalidatePath } from "next/cache"
import { ProfilePage } from "./route"

export async function getProfileById(id: string) {
  const profile = await profileDB.getById(id)

  if (!profile) {
    throw new Error("Profile not found")
  }

  return profile
}

export async function createLink(link: CreateLinkInput) {
  await linkDB.create(link)

  revalidatePath(`${ProfilePage.Url}/${link.profileId}`)
}

export async function updateLink(link: Link) {
  await linkDB.update(link)
}