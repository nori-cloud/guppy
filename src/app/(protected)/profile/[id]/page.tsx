import { Button } from "@/components/ui/button"
import { createLink, getProfileById } from "@/module/profile/action"
import LinkList from "@/module/profile/link-list"
import { ProfilePage } from "@/module/profile/route"
import { revalidatePath } from "next/cache"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const profile = await getProfileById(id)

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Profile {profile.name}</h1>

      <form
        action={async () => {
          "use server"

          await createLink({
            profileId: profile.id,
            title: "test",
            url: "https://test.com",
            type: "generic",
          })

          revalidatePath(ProfilePage.Url)
        }}
      >
        <Button type="submit">Create test link</Button>
      </form>

      <pre className="m-4 h-48 w-full overflow-y-auto border p-4 text-xs">
        {JSON.stringify(profile, null, 2)}
      </pre>

      <LinkList />
    </div>
  )
}
