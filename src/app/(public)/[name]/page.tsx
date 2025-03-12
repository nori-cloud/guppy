import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { profileDB } from "@/db/profile"
import { LinkCard } from "@/module/profile/link-card"
import { getInitials } from "@/system/formatter"
import { HomePage } from "@/system/route"
import { ThemeToggle } from "@/system/theme"
import { redirect } from "next/navigation"

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

  const title = profile.title ?? profile.name

  const initials = getInitials(title)

  return (
    <main className="absolute inset-0 flex flex-col items-center px-4 pt-[10%]">
      <div className="mb-8 flex flex-col items-center gap-2">
        <Avatar className="size-16">
          <AvatarImage src={profile.image ?? undefined} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <h2 className="text-lg font-medium">{title}</h2>
        <p className="text-muted-foreground text-sm">{profile.bio}</p>
      </div>

      <div className="flex w-full max-w-2xl flex-1 flex-col gap-3 pb-24">
        {profile.links
          .filter((link) => link.enabled)
          .map((link, index) => (
            <LinkCard key={index} link={link} />
          ))}
      </div>

      <ThemeToggle className="absolute top-2 right-2" />

      <div className="bg-background sticky bottom-0 mt-auto flex w-full items-center justify-center gap-1 py-3 text-xs">
        {"Power by "}
        <HomePage.Link>
          <span className="text-lg font-bold hover:underline">Guppy</span>
        </HomePage.Link>
      </div>
    </main>
  )
}
