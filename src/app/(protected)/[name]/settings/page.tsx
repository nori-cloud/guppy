import { getProfileByName, updateProfile } from "@/module/editor/action"
import { ProfileSetting } from "@/module/editor/profile-setting"
import { SettingsPage } from "@/system/route"

export const metadata = SettingsPage.Metadata

export default async function SettingPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params

  const profile = await getProfileByName(name)

  return (
    <div className="flex flex-3 p-6">
      <ProfileSetting profile={profile} onUpdate={updateProfile} />
    </div>
  )
}
