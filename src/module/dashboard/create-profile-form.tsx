"use client"
import { useState, useTransition } from "react"
import { z } from "zod"
import { Icon } from "./component/icon"

const createProfileSchema = z.object({
  name: z.string().min(1),
})

export function CreateProfileForm({
  onCreate,
}: {
  onCreate: ({ name }: { name: string }) => void
}) {
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function action(formData: FormData) {
    startTransition(async () => {
      const name = formData.get("name")

      const result = createProfileSchema.safeParse({ name })

      if (!result.success) {
        setError(result.error.message)
        return
      }

      await onCreate({ name: result.data.name })
      setIsCreating(false)
      setError(null)
    })
  }

  return isCreating ? (
    <form
      action={action}
      className="border-foreground/80 text-foreground/80 hover:text-foreground hover:border-foregroun flex cursor-pointer flex-col rounded-md border p-4 transition-colors"
    >
      <input type="text" name="name" placeholder="Profile Name" />

      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-auto flex justify-end gap-2">
        <button type="submit" disabled={isPending}>
          <Icon icon="check" />
        </button>
        <button onClick={() => setIsCreating(false)}>
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
