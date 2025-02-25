import { getProfile } from "./profile"
import { ProfileRole } from "./schema"
import { getCurrentUser } from "./user"

export type CurrentUser = NonNullable<
  Awaited<ReturnType<typeof getCurrentUser>>
>
export type Profile = NonNullable<Awaited<ReturnType<typeof getProfile>>> & {
  role: ProfileRole
}
