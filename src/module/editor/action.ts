"use server"

import { linkDB } from "@/db/link"
import { CreateLinkInput, Link, UpdateLinkInput, UpdateProfileInput } from "@/db/model"
import { profileDB } from "@/db/profile"
import { EditorPage, SettingsPage } from "@/system/route"
import { revalidatePath } from "next/cache"

export async function getProfileById(id: string) {
  const profile = await profileDB.getById(id)

  if (!profile) {
    throw new Error("Profile not found")
  }

  return profile
}

export async function getProfileByName(name: string) {
  const profile = await profileDB.getByName(name)

  if (!profile) {
    throw new Error("Profile not found")
  }

  return profile
}

export async function updateProfile(profile: UpdateProfileInput) {
  await profileDB.update(profile)

  revalidatePath(SettingsPage.Url())
}

export async function generateRandomProfileImage() {
  const randomId = Math.floor(Math.random() * 301)
  const response = await fetch(`https://picsum.photos/id/${randomId}/200/300`)

  revalidatePath(SettingsPage.Url())

  return response.url
}

export async function createLink(link: CreateLinkInput) {
  const metadata = await getLinkMetadata(link.url)
  const title = (!!metadata.title && link.title === "") ? metadata.title : link.title

  await linkDB.create({ ...link, title, enabled: !!title && !!link.url })

  revalidatePath(EditorPage.Url())
}

export async function updateLink(link: UpdateLinkInput & { profileId: string }) {
  const metadata = await getLinkMetadata(link.url)

  const title = (!!metadata.title && link.title === "") ? metadata.title : link.title

  await linkDB.update({ ...link, title, enabled: !!title && !!link.url && link.enabled })

  revalidatePath(EditorPage.Url())
}

export async function reorderLinks(links: Link[]) {
  await linkDB.reorder(links)

  revalidatePath(EditorPage.Url())
}

export async function removeLink(id: number) {
  await linkDB.remove(id)

  revalidatePath(EditorPage.Url())
}

type LinkMetadata = {
  title: string | null
  description: string | null
  image: string | null
  favicon: string | null
  siteName: string | null
  url: string
}

export async function getLinkMetadata(url: string): Promise<LinkMetadata> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Guppy Link Preview Bot",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`)
    }

    const html = await response.text()

    // Create a simple parser to extract metadata
    const getMetaTag = (name: string): string | null => {
      const match = html.match(
        new RegExp(`<meta(?:\\s+|\\s+[^>]*\\s+)(?:name|property)=["']${name}["'][^>]*>`, "i")
      )
      if (!match) return null

      const contentMatch = match[0].match(/content=["']([^"']*)["']/i)
      return contentMatch ? contentMatch[1] : null
    }

    const getTitle = (): string | null => {
      const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i)
      return titleMatch ? titleMatch[1].trim() : null
    }

    // Extract base URL for resolving relative paths
    const baseUrl = new URL(url).origin

    // Resolve relative URLs to absolute URLs
    const resolveUrl = (path: string | null): string | null => {
      if (!path) return null
      if (path.startsWith("http://") || path.startsWith("https://")) return path
      if (path.startsWith("/")) return `${baseUrl}${path}`
      return `${baseUrl}/${path}`
    }

    // Extract metadata
    const title = getMetaTag("og:title") || getTitle()
    const description = getMetaTag("og:description") || getMetaTag("description")

    // Get image from OpenGraph or Twitter
    const imageUrl = getMetaTag("og:image") || getMetaTag("twitter:image")
    const image = resolveUrl(imageUrl)

    // Get favicon
    const faviconMatch = html.match(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']*)["'][^>]*>/i)
    const faviconPath = faviconMatch ? faviconMatch[1] : "/favicon.ico"
    const favicon = resolveUrl(faviconPath)

    const siteName = getMetaTag("og:site_name")

    return {
      title,
      description,
      image,
      favicon,
      siteName,
      url,
    }
  } catch (error) {
    console.error("Error fetching link metadata:", error)

    // Return default values if fetching fails
    return {
      title: null,
      description: null,
      image: null,
      favicon: null,
      siteName: null,
      url,
    }
  }
}

