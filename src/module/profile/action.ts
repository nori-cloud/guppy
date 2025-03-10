'use server'
import * as SteamAPI from "../editor/connection-provider/steam"

export async function getSteamLinkInfo(steamId: string) {
  const playerSummaryResponse = await SteamAPI.GetPlayerSummary(steamId)

  if (!playerSummaryResponse.data) {
    console.warn("failed to fetch player summary for ", steamId, playerSummaryResponse.error)
    return null
  }

  const player = playerSummaryResponse.data.response.players[0]

  const recentlyPlayedGamesResponse = await SteamAPI.GetRecentlyPlayedGames(steamId)

  if (!recentlyPlayedGamesResponse.data) {
    console.warn("failed to fetch recently played games for ", steamId, recentlyPlayedGamesResponse.error)
    return null
  }

  const recentlyPlayedGames = recentlyPlayedGamesResponse.data.response.games

  return {
    player,
    recentlyPlayedGames
  }
}