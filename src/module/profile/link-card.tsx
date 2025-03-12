import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Icon } from "@/components/ui/icon"
import { type Link } from "@/db/model"
import { cn } from "@/lib/utils"
import { formatPlaytime, getInitials } from "@/system/formatter"
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

function LinkContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <Card className={cn("p-1", className)}>{children}</Card>
}

function GenericLink({ link }: { link: Link }) {
  return (
    <LinkContainer>
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 p-2 text-left text-sm"
      >
        {link.title}
      </a>
    </LinkContainer>
  )
}

function YoutubeLink({ link }: { link: Link }) {
  // Extract video ID from YouTube URL
  const videoId = extractYoutubeVideoId(link.url)

  return (
    <LinkContainer>
      <div className="aspect-video w-full">
        <iframe
          className="h-full w-full rounded-md"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={link.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </LinkContainer>
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
    <LinkContainer>
      <img
        src={link.url}
        alt={link.title}
        className="h-full w-full rounded-md object-contain"
      />
    </LinkContainer>
  )
}

async function SteamLink({ link }: { link: Link }) {
  const steamInfo = await getSteamLinkInfo(link.url)

  if (!steamInfo) {
    return (
      <LinkContainer className="p-3 text-sm dark:hover:bg-zinc-800">
        {`Something went wrong when fetching data from Steam, check if your Steam
        ID is correct! [${link.url}]`}
      </LinkContainer>
    )
  }

  return (
    <LinkContainer className="flex-col p-2 dark:hover:bg-zinc-800">
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

      {steamInfo.visibility === "public" && (
        <div className="flex w-full flex-col items-center gap-2">
          <p className="text-muted-foreground text-xs">
            {`Recently Played Games`}
          </p>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 self-stretch">
            {steamInfo.recentlyPlayedGames.map((game) => (
              <a
                key={game.appid}
                href={game.store_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex cursor-pointer items-center gap-1 overflow-clip rounded-md"
              >
                <div className="absolute inset-0 flex items-center justify-center gap-1 rounded-md bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {"Steam Store"}
                  <Icon icon="external-link" className="size-4" />
                </div>

                <img src={game.banner} alt={game.name} />

                <div className="absolute inset-x-0 top-1/2 bottom-0 flex items-end justify-end bg-gradient-to-t from-black/80 to-transparent p-1">
                  <p className="text-sm">
                    {formatPlaytime(game.playtime_2weeks)}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {steamInfo.visibility === "private" && (
        <div className="text-muted-foreground flex items-center justify-center text-sm">
          {"Looks like this is a private profile"}
        </div>
      )}

      {/* <pre className="h-40 w-full overflow-auto text-wrap">
        {JSON.stringify(steamInfo, null, 2)}
      </pre> */}
    </LinkContainer>
  )
}
