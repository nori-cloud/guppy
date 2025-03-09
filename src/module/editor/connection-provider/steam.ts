'use server'
import { env } from "@/system/env"

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
async function GetRecentlyPlayedGames(steamid: string) {
  const params = new URLSearchParams({
    key: env.Steam.APIKey,
    steamid,
    include_appinfo: "true",
  })

  const response = await fetch(
    "http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001?" +
    params.toString(),
  )

  const data: SteamAPIResponse<{ totalCount: number, games: SteamGame[] }> = await response.json()

  return data;
}

type SteamPlayer = {
  steamid: string
  communityvisibilitystate: number
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
async function GetPlayerSummary(steamids: string) {
  const params = new URLSearchParams({
    key: env.Steam.APIKey,
    steamids,
  })

  const response = await fetch(
    "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002?" +
    params.toString(),
  )

  const data: SteamAPIResponse<{ players: SteamPlayer[] }> = await response.json()

  return data;
}


export const SteamAPI = {
  GetRecentlyPlayedGames,
  GetPlayerSummary,
}