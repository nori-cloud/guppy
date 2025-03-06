import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { profileDB } from "@/db/profile"
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
    redirect(HomePage.Url)
  }

  const initials = profile.name
    .split("-")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <main className="h-screen w-screen px-4 pt-[10vh]">
      <div className="mb-8 flex flex-col items-center gap-2">
        <Avatar className="size-16 text-xl">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <h2 className="text-lg font-medium">{name}</h2>
      </div>

      <div className="mb-8 flex flex-1 flex-col gap-3 overflow-y-auto">
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

      <div className="fixed inset-x-0 bottom-0 flex items-center justify-center gap-1 py-6">
        {"Power by "}
        <HomePage.Link>
          <span className="text-2xl font-bold hover:underline">Guppy</span>
        </HomePage.Link>
      </div>
    </main>
  )
}
