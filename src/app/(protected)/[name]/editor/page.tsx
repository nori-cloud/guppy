import { getProfileByName } from "@/module/editor/action"
import { OptimisticLinkEditor } from "@/module/editor/optimistic-link-editor"
import { EditorPage } from "@/system/route"

export const metadata = EditorPage.Metadata

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params

  const profile = await getProfileByName(name)

  return <OptimisticLinkEditor links={profile.links} profile={profile} />
}
