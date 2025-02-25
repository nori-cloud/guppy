import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createProfile } from "@/db/profile"
import { getCurrentUser } from "@/db/user"
import { ProfileGrid } from "@/module/dashboard/profile-grid"
import { DashboardRoute } from "@/module/dashboard/route"
import { revalidatePath } from "next/cache"

export default async function Page() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return <>wooo, something is really wrong</>
  }

  const hasProfile = currentUser?.profiles.length > 0

  return (
    <div className="mx-auto h-screen max-w-5xl">
      <h1>Dashboard</h1>

      <p>Welcome {currentUser.name}</p>

      {hasProfile ? (
        <ProfileGrid profiles={currentUser.profiles} />
      ) : (
        <InitialProfileForm />
      )}
    </div>
  )
}

function InitialProfileForm() {
  async function action() {
    "use server"

    await createProfile({
      name: "test",
    })

    revalidatePath(DashboardRoute.Index.Url)
  }

  return (
    <form action={action}>
      <p>{"Look like you don't have a profile yet"}</p>
      <p>Create one now!</p>

      <Input name="name" placeholder="Profile name" />

      <Button type="submit">Create profile</Button>
    </form>
  )
}
