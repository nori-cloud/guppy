import { profileDB } from "@/db/profile"
import { Env } from "@/module/analytics/env"
import { checkCurrentUserCanEditProfile } from "@/module/profile/action"
import { HomePage } from "@/system/route"
import { redirect } from "next/navigation"
import Script from "next/script"
import { ProfileContainer } from "./profile-container"

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
        <Script
          defer
          src={`${Env.Umami.PublicEndpoint}/script.js`}
          data-website-id={profile.trackingId}
        />
      )}
      <ProfileContainer canEdit={canEdit} profile={profile} />
    </>
  )
}
