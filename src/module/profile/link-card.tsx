import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icon } from "@/components/ui/icon"
import { type Link } from "@/db/model"
import { getInitials } from "@/system/formatter"
import { getSteamLinkInfo } from "./action"

export async function LinkCard({ link }: { link: Link }) {
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

async function SteamLink({ link }: { link: Link }) {
  const steamInfo = await getSteamLinkInfo(link.url)

  if (!steamInfo) {
    return (
      <div className="flex flex-col items-center justify-between gap-1 overflow-clip rounded-lg bg-zinc-800 p-3 text-sm transition-colors hover:bg-zinc-700">
        {`Something went wrong when fetching data from Steam, check if your Steam
        ID is correct! [${link.url}]`}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 overflow-clip rounded-lg bg-zinc-800 p-4 transition-colors hover:bg-zinc-700">
      <div className="flex items-center gap-2">
        <Avatar className="size-12">
          <AvatarImage src={steamInfo.player.avatarfull} />
          <AvatarFallback>
            {getInitials(steamInfo.player.personaname ?? "")}
          </AvatarFallback>
        </Avatar>

        <div>
          <p className="flex items-center gap-1">
            {steamInfo.player.personaname}
            <a
              href={steamInfo.player.profileurl}
              className="inline-block hover:text-blue-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon icon="external-link" className="my-auto size-4" />
            </a>
          </p>

          <p className="text-muted-foreground text-xs">
            {`Last Online: ${new Date(steamInfo.player.lastlogoff * 1000).toLocaleString()}`}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {steamInfo.recentlyPlayedGames.map((game) => (
          <div key={game.appid} className="flex items-center gap-1">
            <img
              src={`http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
              alt={game.name}
              className="size-5"
            />
            <p className="text-sm">{`${game.name} (${Math.floor(game.playtime_forever / 60)} hours)`}</p>
          </div>
        ))}
      </div>

      {/* <pre className="h-40 w-full overflow-auto text-wrap">
        {JSON.stringify(steamInfo, null, 2)}
      </pre> */}
    </div>
  )
}
