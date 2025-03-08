import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { profileDB } from "@/db/profile"
import { getInitials } from "@/system/formatter"
import { HomePage } from "@/system/route"
import { redirect } from "next/navigation"

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

      <div className="flex max-w-2xl flex-1 flex-col gap-3 overflow-y-auto">
        {profile.links
          .filter((link) => link.enabled)
          .map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-between rounded-lg bg-zinc-800 px-4 py-3 text-left transition-colors hover:bg-zinc-700"
            >
              <span className="text-sm">{link.title}</span>
            </a>
          ))}
      </div>

      <div className="mt-auto flex items-center justify-center gap-1 py-6">
        {"Power by "}
        <HomePage.Link>
          <span className="text-2xl font-bold hover:underline">Guppy</span>
        </HomePage.Link>
      </div>
    </main>
  )
}
