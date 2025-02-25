import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Profile } from "@/db/model"
import { createProfile, deleteProfile } from "@/db/profile"
import { getCurrentUser } from "@/db/user"
import { Icon } from "@/module/dashboard/component/icon"
import { CreateProfileForm } from "@/module/dashboard/create-profile-form"
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

function ProfileGrid({ profiles }: { profiles: Profile[] }) {
  return (
    <div className="grid auto-rows-[200px] grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
      {profiles.map((profile) => (
        <div
          className="bg-foreground text-background flex flex-col rounded-md p-4"
          key={profile.id}
        >
          <div className="flex items-center justify-between">
            <p className="text-2xl">{profile.name}</p>
            <Badge>{profile.role}</Badge>
          </div>

          <div className="mt-auto flex items-center justify-between">
            <p>Likes: 100</p>
            <p>Views: 100</p>
            <p>Clicks: 100</p>
          </div>

          <div className="mt-2 flex items-center justify-end gap-1">
            <form
              action={async () => {
                "use server"
                await deleteProfile(profile.id)
                revalidatePath(DashboardRoute.Index.Url)
              }}
            >
              <button
                type="submit"
                className="hover:bg-destructive bg-destructive/80 cursor-pointer rounded-md px-2 py-1 transition-colors"
              >
                <Icon icon="trash" className="text-foreground size-4" />
              </button>
            </form>

            <button className="hover:border-background/80 border-background/40 cursor-pointer rounded-md border px-2 py-1 transition-colors">
              <Icon icon="right-arrow" className="size-4" />
            </button>
          </div>
        </div>
      ))}

      <CreateProfileForm
        onCreate={async ({ name }) => {
          "use server"

          await createProfile({
            name,
          })

          revalidatePath(DashboardRoute.Index.Url)
        }}
      />
    </div>
  )
}
