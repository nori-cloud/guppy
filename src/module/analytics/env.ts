import { z } from "zod"

const umamiSchema = z.object({
    ClientUserId: z.string(),
    ClientSecret: z.string(),
    APIEndpoint: z.string(),
    PublicEndpoint: z.string(),

})

export const Env = {
    Umami: umamiSchema.parse({
        ClientUserId: process.env.UMAMI_API_CLIENT_USER_ID,
        ClientSecret: process.env.UMAMI_API_CLIENT_SECRET,
        APIEndpoint: process.env.UMAMI_API_ENDPOINT,
        PublicEndpoint: process.env.UMAMI_PUBLIC_ENDPOINT,
    })
}