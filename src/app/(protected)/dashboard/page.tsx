import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getCurrentUser } from "@/db/user"
import { createProfile, deleteProfile } from "@/module/dashboard/action"
import { ProfileGrid } from "@/module/dashboard/profile-grid"
import { UserMenu } from "@/module/dashboard/user-menu"
import { DashboardPage } from "@/system/route"
import { revalidatePath } from "next/cache"

export const metadata = DashboardPage.Metadata

export default async function Page() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return <>wooo, something is really wrong</>
  }

  const hasProfile = currentUser?.profiles.length > 0

  const handleCreateProfile = async (name: string) => {
    "use server"
    await createProfile({userId: currentUser.id, profileName: name})
  }
  
  const handleDeleteProfile = async (id: string) => {
    "use server"
    await deleteProfile(id)
  }

  return (
    <div className="mx-auto h-screen max-w-5xl px-8 pt-12">
      <p className="text-2xl">Welcome! {currentUser.name}</p>

      <div className="mt-12 flex flex-col gap-4">
        <p className="text-4xl">Your Profiles</p>

        {hasProfile ? (
          <ProfileGrid profiles={currentUser.profiles} onCreateProfile={handleCreateProfile} onDeleteProfile={handleDeleteProfile} />
        ) : (
          <InitialProfileForm onCreate={handleCreateProfile} />
        )}
      </div>

      <UserMenu className="fixed bottom-6 left-6" user={currentUser} />
    </div>
  )
}

type InitialProfileFormProps = {
  onCreate: (name: string) => Promise<void>
}
function InitialProfileForm({onCreate}: InitialProfileFormProps) {
  async function action(formData: FormData) {
    "use server"

    const name = formData.get("name") as string

    await onCreate(name)

    revalidatePath(DashboardPage.Url())
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
