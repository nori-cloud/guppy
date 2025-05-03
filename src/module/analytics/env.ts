import { z } from "zod"

const umamiSchema = z.object({
    ClientUserId: z.string(),
    ClientSecret: z.string(),
    Endpoint: z.string(),
})

export const Env = {
    Umami: umamiSchema.parse({
        ClientUserId: process.env.UMAMI_API_CLIENT_USER_ID,
        ClientSecret: process.env.UMAMI_API_CLIENT_SECRET,
        Endpoint: process.env.UMAMI_API_CLIENT_ENDPOINT,
    })
}