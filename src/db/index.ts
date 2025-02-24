import { env } from "@/system/env"
import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "./schema"

export const db = drizzle({
  connection: {
    connectionString: env.Drizzle.DatabaseUrl,
    ssl: true,
  },
  schema,
})
