"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Profile } from "@/db/model"
import { EditorPage } from "@/system/route"
import {
  useEffect,
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from "react"
import { z } from "zod"
import { Icon } from "../../components/ui/icon"
import { createProfile, deleteProfile, validateProfileName } from "./action"

const profileNameSchema = z
  .string()
  .nonempty({ message: "cannot be empty" })
  .max(24, { message: "cannot be longer than 24 characters" })
  .regex(/^[a-zA-Z0-9_-]+$/, {
    message: "can only contain letters, numbers, underscores, and hyphens",
  })

function CreateProfileForm({
  onCreate,
}: {
  onCreate: (name: string) => Promise<void>
}) {
  const [isCreateProfile, setIsCreateProfile] = useState(false)
  const [isCreating, startCreateProfileTransition] = useTransition()
  const [profileName, setProfileName] = useState("")

  async function action() {
    setIsCreateProfile(false)
    setError(null)

    startCreateProfileTransition(async () => {
      try {
        await onCreate(profileName)
      } catch (error) {
        setIsCreateProfile(true)
        setError(`Failed to create profile. Please try again. [${error}]`)
      }
    })
  }

  const [isDirty, setIsDirty] = useState(false)
  const [isProfileNameValid, setIsProfileNameValid] = useState(false)
  const [isValidating, startValidateProfileNameTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  async function handleNameChange(name: string) {
    setProfileName(name)
    setIsDirty(true)
    setError(null)

    const result = profileNameSchema.safeParse(name)

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    if (!result.success) {
      setError(result.error.errors[0].message)
      setIsProfileNameValid(false)
      setIsDirty(false)
      return
    }

    debounceTimeout.current = setTimeout(() => {
      startValidateProfileNameTransition(async () => {
        const isValid = await validateProfileName(name)
        setIsProfileNameValid(isValid)
        setIsDirty(false)
      })
    }, 500)
  }

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [])

  function handleCancel() {
    setIsCreateProfile(false)
    setProfileName("")
    setError(null)
  }

  return isCreateProfile ? (
    <form
      action={action}
      className="border-foreground/80 text-foreground/80 flex flex-col rounded-md border p-4 transition-colors"
    >
      <input
        type="text"
        className="border-foreground/40 focus:border-foreground hover:border-foreground/80 border-b transition-colors focus:outline-none"
        value={profileName}
        onChange={(e) => handleNameChange(e.target.value)}
        autoFocus={true}
        placeholder="Profile Name"
      />

      <p className="mt-2 text-wrap break-all underline">
        {`${window.location.origin}/${profileName}`}
        {isValidating || isDirty ? (
          <Icon
            icon="spinner"
            className="ml-1 inline-block size-4 animate-spin"
          />
        ) : isProfileNameValid ? (
          <Icon
            icon="check-circle"
            className="ml-1 inline-block size-4 text-green-400"
          />
        ) : (
          <Icon
            icon="cross-circle"
            className="ml-1 inline-block size-4 text-red-400"
          />
        )}
      </p>

      {error && <p className="text-red-500">{error}</p>}
      {isCreating && (
        <span className="text-foreground/80 italic">Creating...</span>
      )}

      <div className="mt-auto flex justify-end gap-2">
        <button
          className="hover:bg-foreground/20 cursor-pointer rounded-md p-1 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
          type="submit"
          disabled={isCreating || !isProfileNameValid}
        >
          <Icon icon="check" />
        </button>
        <button
          className="hover:bg-foreground/20 cursor-pointer rounded-md p-1"
          onClick={handleCancel}
        >
          <Icon icon="cross" />
        </button>
      </div>
    </form>
  ) : (
    <button
      className="text-foreground/80 hover:text-foreground hover:border-foreground cursor-pointer rounded-md border border-dashed p-4 transition-colors"
      onClick={() => setIsCreateProfile(true)}
    >
      + New Profile
    </button>
  )
}

export function ProfileGrid({
  profiles,
}: {
  profiles: Omit<Profile, "links" | "bio" | "createdAt" | "updatedAt">[]
}) {
  const [optimisticProfiles, setOptimisticProfiles] = useOptimistic(profiles)

  const handleOptimisticCreateProfile = async (name: string) => {
    setOptimisticProfiles([
      ...optimisticProfiles,
      { id: "optimistic", name, image: null, role: "owner", title: name },
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
        <Card className="p-4" key={profile.id}>
          <div className="flex items-center justify-between">
            <p className="text-2xl">{profile.name}</p>
            <Badge>{profile.role}</Badge>
          </div>

          <div className="mt-auto flex items-center justify-end gap-1">
            <form
              action={async () =>
                await handleOptimisticDeleteProfile(profile.id)
              }
            >
              <Button type="submit" variant="destructive" className="size-8">
                <Icon icon="trash" />
              </Button>
            </form>

            <EditorPage.Link name={profile.name}>
              <Button
                variant="outline"
                disabled={profile.id === "optimistic"}
                className="size-8"
              >
                <Icon icon="arrow-right" />
              </Button>
            </EditorPage.Link>
          </div>
        </Card>
      ))}

      <CreateProfileForm onCreate={handleOptimisticCreateProfile} />
    </div>
  )
}
