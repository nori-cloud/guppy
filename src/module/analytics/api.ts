import type { User, Website } from "@umami/api-client"
import { Umami } from "./env"

export async function registerProfile(profileId: string) {
  try {
    const res = await fetch(`${Umami.Url}/api/auth/login`, {
      method: "POST",
      body: JSON.stringify({
        username: Umami.Username,
        password: Umami.Password,
      }),
    })

    const { token, user } = await res.json() as {
      token: string
      user: User
    }

    console.debug("umami login", { token, user })

    const result = await fetch(`${Umami.Url}/api/websites`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: profileId,
        domain: Umami.BaseDomain || "localhost",
      }),
    })

    const website = await result.json() as Website

    console.debug("umami create website", { website })

    return website.id as string
  } catch (error) {
    console.error("Error creating website", error)

    return null
  }
}
