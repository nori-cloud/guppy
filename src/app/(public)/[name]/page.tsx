import { profileDB } from "@/db/profile"
import { checkCurrentUserCanEditProfile } from "@/module/profile/action"
import { HomePage } from "@/system/route"
import { redirect } from "next/navigation"
import { ProfileContainer } from "./profile-container"
import { LoadAnalyticsScript } from "@/module/analytics/component"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params

  const profile = await profileDB.getByName(name)

  if (!profile) {
    redirect(HomePage.Url())
  }

  return {
    title: profile.title ?? profile.name,
  }
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params

  const profile = await profileDB.getByName(name)

  if (!profile) {
    redirect(HomePage.Url())
  }

  const canEdit = await checkCurrentUserCanEditProfile(name)

  return (
    <>
      {profile.trackingId && (
        <LoadAnalyticsScript trackingId={profile.trackingId} />
      )}
      <ProfileContainer canEdit={canEdit} profile={profile} />
    </>
  )
}
