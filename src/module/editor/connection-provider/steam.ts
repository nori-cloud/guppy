import { Steam } from "@/system/env"

type SteamAPIResponse<T> = {
  response: T
}

type SteamGame = {
  appid: number
  name: string
  playtime_2weeks: number
  playtime_forever: number
  img_icon_url: string
  playtime_windows_forever: number
  playtime_mac_forever: number
  playtime_linux_forever: number
  playtime_deck_forever: number
}
export async function GetRecentlyPlayedGames(steamid: string) {
  if (!Steam) {
    console.error("Missing Steam API Key")
    return { data: null, error: "STEAM_API_KEY is not set" } as const
  }

  const params = new URLSearchParams({
    key: Steam.APIKey,
    steamid,
    include_appinfo: "true",
  })

  const url = "http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001?" +
    params.toString()

  const response = await fetch(url)

  if (!response.ok) {
    console.warn("failed to fetch recently played games for ", steamid, response.statusText)
    return { data: null, error: await response.text() } as const
  }

  const data: SteamAPIResponse<{ totalCount: number, games: SteamGame[] }> = await response.json()

  return { data, error: null } as const;
}

type CommunityVisibilityState = 1 | 3
type SteamPlayer = {
  steamid: string
  communityvisibilitystate: CommunityVisibilityState
  profilestate: number
  personaname: string
  profileurl: string
  avatar: string
  avatarmedium: string
  avatarfull: string
  avatarhash: string
  lastlogoff: number
  personastate: number
  primaryclanid: string
  timecreated: number
  personastateflags: number
  loccountrycode: string
  locstatecode: string
  loccityid: number
}
export async function GetPlayerSummary(steamids: string) {
  if (!Steam) {
    console.error("Missing Steam API Key")
    return { data: null, error: "STEAM_API_KEY is not set" } as const
  }

  const params = new URLSearchParams({
    key: Steam.APIKey,
    steamids,
  })

  const response = await fetch(
    "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002?" +
    params.toString(),
  )

  if (!response.ok) {
    console.warn("failed to fetch player summary for ", steamids, response.statusText)
    return { data: null, error: await response.text() } as const
  }

  const data: SteamAPIResponse<{ players: SteamPlayer[] }> = await response.json()

  if (data.response.players.length === 0) {
    return { data: null, error: "No players found" } as const
  }

  return { data, error: null } as const;
}

export async function GetProfileVisibility(number: 1 | 3) {
  return number === 1 ? "private" : "public"
}

type SteamStoreGameDetails = {
  type: string
  name: string
  steam_appid: number
  required_age: number
  is_free: boolean
  detailed_description: string
  about_the_game: string
  short_description: string
  supported_languages: string
  header_image: string
  website: string
  developers: string[]
  publishers: string[]
  price_overview?: {
    currency: string
    initial: number
    final: number
    discount_percent: number
    initial_formatted: string
    final_formatted: string
  }
  categories?: Array<{ id: number, description: string }>
  genres?: Array<{ id: string, description: string }>
  release_date: {
    coming_soon: boolean
    date: string
  }
  // There are many more fields available
}

export async function GetGameDetails(appIds: number[]) {
  // Steam Store API requires a different approach - we need to make individual requests
  // for each app ID and specify we want details from the store

  const results: Record<string, SteamStoreGameDetails | null> = {};

  // Process requests sequentially to avoid rate limiting
  for (const appId of appIds) {
    const url = `https://store.steampowered.com/api/appdetails?appids=${appId}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        console.warn(`Failed to fetch game details for appId ${appId}`, response.statusText);
        results[appId.toString()] = null;
        continue;
      }

      const data = await response.json();

      // The Steam Store API returns data in a different structure with app ID as key
      if (data[appId] && data[appId].success) {
        results[appId.toString()] = data[appId].data;
      } else {
        results[appId.toString()] = null;
      }
    } catch (error) {
      console.error(`Error fetching game details for appId ${appId}:`, error);
      results[appId.toString()] = null;
    }
  }

  return { data: results, error: null } as const;
}
