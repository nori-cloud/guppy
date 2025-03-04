import { InferInsertModel, InferSelectModel } from "drizzle-orm"
import { profileDB } from "./profile"
import { links, ProfileRole } from "./schema"
import { getCurrentUser } from "./user"

export type CurrentUser = NonNullable<
  Awaited<ReturnType<typeof getCurrentUser>>
>
export type Profile = NonNullable<
  Awaited<ReturnType<typeof profileDB.getById>>
> & {
  role?: ProfileRole
}

export type UpdateLinkInput = Omit<InferSelectModel<typeof links>, 'createdAt' | 'updatedAt' | 'profileId'>
export type CreateLinkInput = InferInsertModel<typeof links>
export type Link = Profile["links"][number]
