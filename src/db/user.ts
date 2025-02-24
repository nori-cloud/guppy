import { auth } from "@/system/auth";
import { db } from ".";

export async function getCurrentUser() {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("User not found");
  }

  const { email } = session.user;

  const currentUser = await db.query.users.findFirst({
    columns: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
    where: (users, { eq }) => eq(users.email, email),
    with: {
      usersToProfiles: {
        with: {
          profile: true,
        },
      },
    },
  });

  if (!currentUser) {
    return null;
  }

  return {
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    image: currentUser.image,
    profiles: currentUser.usersToProfiles.map((userToProfile) => ({
      profileId: userToProfile.profileId,
      role: userToProfile.role,
      name: userToProfile.profile.name,
      image: userToProfile.profile.image,
    })),
  };
}
