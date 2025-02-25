import { PgInsertValue } from "drizzle-orm/pg-core"
import { profileDB } from "./profile"
import { links, ProfileRole } from "./schema"
import { getCurrentUser } from "./user"

export type CurrentUser = NonNullable<
  Awaited<ReturnType<typeof getCurrentUser>>
>
export type Profile = NonNullable<
  Awaited<ReturnType<typeof profileDB.getById>>
> & {
  role: ProfileRole
}

export type CreateLinkInput = PgInsertValue<typeof links>
