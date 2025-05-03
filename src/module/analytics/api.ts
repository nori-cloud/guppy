import * as umami from "@umami/api-client"
import { Env } from "./env"

const client = umami.getClient({
  userId: Env.Umami.ClientUserId,
  secret: Env.Umami.ClientSecret,
  apiEndpoint: `${Env.Umami.Endpoint}/api`,
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
