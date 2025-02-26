import { Button } from "@/components/ui/button"
import { Link } from "@/db/model"
import {
  createLink,
  getProfileById,
  reorderLinks,
} from "@/module/profile/action"
import LinkList from "@/module/profile/link-list"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const profile = await getProfileById(id)

  const handleUpdateLink = async (links: Link[]) => {
    "use server"
    await reorderLinks(links)
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Profile {profile.name}</h1>

      <form
        action={async () => {
          "use server"
          await createLink({
            profileId: profile.id,
            title: "test " + profile.links.length,
            url: "https://test.com",
            type: "generic",
            order: profile.links.length,
          })
        }}
      >
        <Button type="submit">Create test link</Button>
      </form>

      <div className="grid grid-cols-2 gap-4">
        <pre className="m-4 w-full overflow-y-auto border p-4 text-xs">
          {JSON.stringify(profile, null, 2)}
        </pre>

        <LinkList links={profile.links} onOrderChange={handleUpdateLink} />
      </div>
    </div>
  )
}
