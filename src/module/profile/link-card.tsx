"use client"

import { type Link } from "@/db/model"

export function LinkCard({ link }: { link: Link }) {
  switch (link.type) {
    case "generic":
      return <GenericLink link={link} />

    case "youtube":
      return <YoutubeLink link={link} />

    case "image":
      return <ImageLink link={link} />

    case "steam":
      return <SteamLink link={link} />

    default:
      return <></>
  }
}

function GenericLink({ link }: { link: Link }) {
  return (
    <div className="flex items-center justify-between gap-1 overflow-clip rounded-lg bg-zinc-800 p-1 transition-colors hover:bg-zinc-700">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 p-2 text-left text-sm"
      >
        {link.title}
      </a>
    </div>
  )
}

function YoutubeLink({ link }: { link: Link }) {
  // Extract video ID from YouTube URL
  const videoId = extractYoutubeVideoId(link.url)

  return (
    <div className="flex items-center justify-between gap-1 overflow-clip rounded-lg bg-zinc-800 p-1 transition-colors hover:bg-zinc-700">
      <div className="aspect-video w-full">
        <iframe
          className="h-full w-full rounded-md"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={link.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}

// Helper function to extract YouTube video ID from various YouTube URL formats
function extractYoutubeVideoId(url: string): string {
  // Default video ID in case extraction fails
  const defaultVideoId = "dQw4w9WgXcQ"

  try {
    // Handle different YouTube URL formats
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    const match = url.match(regExp)

    return match && match[7].length === 11 ? match[7] : defaultVideoId
  } catch {
    // Return default video ID if parsing fails
    return defaultVideoId
  }
}

function ImageLink({ link }: { link: Link }) {
  return (
    <div className="flex items-center justify-between gap-1 overflow-clip rounded-lg bg-zinc-800 p-1 transition-colors hover:bg-zinc-700">
      <img
        src={link.url}
        alt={link.title}
        className="h-full w-full rounded-md object-contain"
      />
    </div>
  )
}

function SteamLink({ link }: { link: Link }) {
  return (
    <div className="flex items-center justify-between gap-1 overflow-clip rounded-lg bg-zinc-800 p-1 transition-colors hover:bg-zinc-700">
      <p className="p-2 text-sm">{`Steam ID: ${link.url}`}</p>
    </div>
  )
}
