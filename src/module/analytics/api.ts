import * as umami from "@umami/api-client"
import { Umami } from "./env"

const client = umami.getClient({
  userId: Umami.ClientUserId,
  secret: Umami.ClientSecret,
  apiEndpoint: Umami.APIEndpoint,
})

async function createWebsite({
  name,
  domain,
}: {
  name: string
  domain: string
}) {
  const result = await client.createWebsite({
    name,
    domain,
  })

  console.debug("umami create website", { result })

  if (!result.ok) {
    throw new Error(result.error)
  }

  return result.data
}

export const analyticsAPI = {
  umami: client,
  createWebsite,
}
