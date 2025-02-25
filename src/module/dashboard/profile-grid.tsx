"use client"
import { Badge } from "@/components/ui/badge"
import { Profile } from "@/db/model"
import { useOptimistic, useState, useTransition } from "react"
import { z } from "zod"
import { ProfilePage } from "../profile/route"
import { createProfile, deleteProfile } from "./action"
import { Icon } from "./component/icon"

const createProfileSchema = z.object({
  name: z.string().min(1),
})

function CreateProfileForm({
  onCreate,
}: {
  onCreate: (name: string) => Promise<void>
}) {
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function action(formData: FormData) {
    const name = formData.get("name")

    const result = createProfileSchema.safeParse({ name })

    if (!result.success) {
      setError(result.error.message)
      return
    }

    setIsCreating(false)
    setError(null)

    startTransition(async () => {
      try {
        await onCreate(result.data.name)
      } catch (error) {
        setIsCreating(true)
        setError(`Failed to create profile. Please try again. [${error}]`)
      }
    })
  }

  return isCreating ? (
    <form
      action={action}
      className="border-foreground/80 text-foreground/80 hover:text-foreground hover:border-foregroun flex cursor-pointer flex-col rounded-md border p-4 transition-colors"
    >
      <input
        type="text"
        name="name"
        autoFocus={true}
        placeholder="Profile Name"
      />

      {error && <p className="text-red-500">{error}</p>}
      {isPending && (
        <span className="text-foreground/80 italic">Creating...</span>
      )}

      <div className="mt-auto flex justify-end gap-2">
        <button
          className="hover:bg-foreground/20 cursor-pointer rounded-md p-1"
          type="submit"
          disabled={isPending}
        >
          <Icon icon="check" />
        </button>
        <button
          className="hover:bg-foreground/20 cursor-pointer rounded-md p-1"
          onClick={() => setIsCreating(false)}
        >
          <Icon icon="cross" />
        </button>
      </div>
    </form>
  ) : (
    <button
      className="border-foreground/80 text-foreground/80 hover:text-foreground hover:border-foregroun cursor-pointer rounded-md border border-dashed p-4 transition-colors"
      onClick={() => setIsCreating(true)}
    >
      + New Profile
    </button>
  )
}

export function ProfileGrid({ profiles }: { profiles: Profile[] }) {
  const [optimisticProfiles, setOptimisticProfiles] = useOptimistic(profiles)

  const handleOptimisticCreateProfile = async (name: string) => {
    setOptimisticProfiles([
      ...optimisticProfiles,
      { id: "optimistic", name, image: null, role: "owner" },
    ])
    await createProfile(name)
  }

  const handleOptimisticDeleteProfile = async (id: string) => {
    setOptimisticProfiles(
      optimisticProfiles.filter((profile) => profile.id !== id),
    )
    await deleteProfile(id)
  }

  return (
    <div className="grid auto-rows-[200px] grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
      {optimisticProfiles.map((profile) => (
        <div
          className="bg-foreground text-background flex flex-col rounded-md p-4"
          key={profile.id}
        >
          <div className="flex items-center justify-between">
            <p className="text-2xl">{profile.name}</p>
            <Badge>{profile.role}</Badge>
          </div>

          <div className="mt-auto flex items-center justify-between">
            <p>Likes: 100</p>
            <p>Views: 100</p>
            <p>Clicks: 100</p>
          </div>

          <div className="mt-2 flex items-center justify-end gap-1">
            <form
              action={async () =>
                await handleOptimisticDeleteProfile(profile.id)
              }
            >
              <button
                type="submit"
                className="hover:bg-destructive bg-destructive/80 cursor-pointer rounded-md px-2 py-1 transition-colors"
              >
                <Icon icon="trash" className="text-foreground size-4" />
              </button>
            </form>

            <ProfilePage.Link id={profile.id}>
              <button
                disabled={profile.id === "optimistic"}
                className="hover:border-background/80 border-background/40 cursor-pointer rounded-md border px-2 py-1 transition-colors"
              >
                <Icon icon="right-arrow" className="size-4" />
              </button>
            </ProfilePage.Link>
          </div>
        </div>
      ))}

      <CreateProfileForm onCreate={handleOptimisticCreateProfile} />
    </div>
  )
}
