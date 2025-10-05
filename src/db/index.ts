import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "./schema"
import { Drizzle } from "@/system/env"


function getDb() {
  return drizzle({
    connection: {
      connectionString: Drizzle.DatabaseUrl,
    },
    schema,
  })
}

export const db = getDb()
