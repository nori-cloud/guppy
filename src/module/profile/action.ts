'use server'
import { profileDB } from "@/db/profile"
import { getCurrentUser } from "@/db/user"
import * as SteamAPI from "../editor/connection-provider/steam"


export async function checkCurrentUserCanEditProfile(name: string) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return false
  }

  const profile = await profileDB.getByName(name)

  if (!profile) {
    return false
  }

  return profileDB.matchUserToProfile(currentUser.id, profile.id)
}


export type SteamLinkInfo = Awaited<ReturnType<typeof getSteamLinkInfo>>
export async function getSteamLinkInfo(steamId: string) {
  const playerSummaryResponse = await SteamAPI.GetPlayerSummary(steamId)

  if (!playerSummaryResponse.data) {
    console.warn("failed to fetch player summary for ", steamId, playerSummaryResponse.error)
    return null
  }

  const player = playerSummaryResponse.data.response.players[0]
  const visibility = await SteamAPI.GetProfileVisibility(player.communityvisibilitystate)

  if (visibility === "private") {
    return {
      visibility,
      player,
    } as const
  }

  const recentlyPlayedGamesResponse = await SteamAPI.GetRecentlyPlayedGames(steamId)

  if (!recentlyPlayedGamesResponse.data) {
    console.warn("failed to fetch recently played games for ", steamId, recentlyPlayedGamesResponse.error)
    return null
  }

  const recentlyPlayedGames = recentlyPlayedGamesResponse.data.response.games

  const appIds = recentlyPlayedGames.map(game => game.appid)

  const productInfo = await SteamAPI.GetGameDetails(appIds)

  const mappedRecentlyPlayedGames = recentlyPlayedGames.map(game => {
    const product = productInfo.data[game.appid]

    if (!product) {
      return
    }

    return {
      appid: game.appid,
      name: product.name,
      icon: `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`,
      playtime_2weeks: game.playtime_2weeks,
      playtime_forever: game.playtime_forever,
      banner: product.header_image,
      store_url: `https://store.steampowered.com/app/${game.appid}`,
    }
  }).filter(game => !!game)


  return {
    visibility,
    player,
    recentlyPlayedGames: mappedRecentlyPlayedGames
  } as const
}