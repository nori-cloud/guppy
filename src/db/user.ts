'use server'

import { db } from "."
import { getSession } from "@/lib/auth-action"

export async function getCurrentUser() {
  const session = await getSession()

  if (!session?.user?.email) {
    return null
  }

  const { email } = session.user

  const currentUser = await db.query.user.findFirst({
    columns: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
    where: (user, { eq }) => eq(user.email, email),
    with: {
      usersToProfiles: {
        with: {
          profile: true,
        },
      },
    },
  })

  if (!currentUser) {
    return null
  }

  return {
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    image: currentUser.image,
    profiles: currentUser.usersToProfiles.map((userToProfile) => ({
      id: userToProfile.profileId,
      role: userToProfile.role,
      name: userToProfile.profile.name,
      image: userToProfile.profile.image,
      title: userToProfile.profile.title,
    })),
  }
}
