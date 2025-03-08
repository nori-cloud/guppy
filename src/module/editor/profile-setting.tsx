"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Profile, UpdateProfileInput } from "@/db/model"
import { getInitials } from "@/system/formatter"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { generateRandomProfileImage } from "./action"
import {
  ControlledInput,
  ControlledTextarea,
} from "./component/controlled-input"
import { FormContainer } from "./component/form-container"

export function ProfileSetting({
  profile,
  onUpdate,
}: {
  profile: Profile
  onUpdate: (profile: UpdateProfileInput) => void
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<UpdateProfileInput>({
    defaultValues: {
      id: profile.id,
      name: profile.name,
      title: profile.title,
      bio: profile.bio,
      image: profile.image,
    },
  })

  return (
    <FormContainer
      onSubmit={handleSubmit(onUpdate)}
      errorMessage={errors.root?.message}
    >
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-8">
            <Avatar className="size-24 text-2xl">
              <AvatarImage src={watch("image") ?? undefined} />
              <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
            </Avatar>

            <AvatarEditor
              onUpdate={(url) => {
                setValue("image", url)
              }}
            />
          </div>

          <ControlledInput
            variant="column"
            name="title"
            control={control}
            label="Title"
          />

          <ControlledTextarea
            variant="column"
            name="bio"
            control={control}
            label="Description"
          />
        </CardContent>

        <CardFooter>
          <Button type="submit">Save</Button>
        </CardFooter>
      </Card>
    </FormContainer>
  )
}

function AvatarEditor({ onUpdate }: { onUpdate: (url: string) => void }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerateLuckyAvatar = async () => {
    setIsLoading(true)
    const url = await generateRandomProfileImage()
    onUpdate(url)
    setIsLoading(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <Button type="button" variant="outline" isLoading={isLoading}>
        Upload New Avatar
      </Button>
      <Button
        type="button"
        variant="outline"
        isLoading={isLoading}
        onClick={handleGenerateLuckyAvatar}
      >
        Feeling Lucky
      </Button>
    </div>
  )
}
