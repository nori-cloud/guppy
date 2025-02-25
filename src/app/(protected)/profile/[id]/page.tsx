import { getProfileById } from "@/module/profile/action"
import LinkList from "@/module/profile/link-list"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const profile = await getProfileById(id)

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-2xl font-bold">Profile {profile.name}</h1>

      <LinkList />
    </div>
  )
}
