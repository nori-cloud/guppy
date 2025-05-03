import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import type { Profile } from "@/db/model"
import { LinkCard } from "@/module/profile/link-card"
import { ShareButton } from "@/module/profile/share-button"
import { getInitials } from "@/system/formatter"
import { EditorPage, HomePage, ProfilePage } from "@/system/route"

export function ProfileContainer({
  profile,
  canEdit,
}: {
  canEdit: boolean
  profile: Profile
}) {
  const title = profile.title ?? profile.name

  return (
    <main className="absolute inset-0 mx-auto flex max-w-5xl flex-col items-center px-4 pt-[10%]">
      {canEdit && (
        <EditorPage.Link name={profile.name}>
          <Button className="absolute top-2 left-2">
            <Icon icon="editor" />
          </Button>
        </EditorPage.Link>
      )}

      <div className="mb-8 flex flex-col items-center gap-2">
        <Avatar className="size-16">
          <AvatarImage src={profile.image ?? undefined} />
          <AvatarFallback>{getInitials(title)}</AvatarFallback>
        </Avatar>
        <h2 className="text-center text-lg font-medium">{title}</h2>
        <p className="text-muted-foreground text-center text-sm">
          {profile.bio}
        </p>
      </div>

      <div className="flex w-full max-w-2xl flex-1 flex-col gap-3 pb-24">
        {profile.links
          .filter((link) => link.enabled)
          .map((link, index) => (
            <LinkCard key={index} link={link} />
          ))}
      </div>

      <ShareButton
        className="absolute top-2 right-2"
        url={ProfilePage.Url({ name: profile.name })}
      />

      <div className="bg-background sticky bottom-0 mt-auto flex w-full items-center justify-center gap-1 py-3 text-xs">
        {"Power by "}
        <HomePage.Link>
          <span className="text-lg font-bold hover:underline">Guppy</span>
        </HomePage.Link>
      </div>
    </main>
  )
}
