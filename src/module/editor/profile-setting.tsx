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
import { useForm } from "react-hook-form"
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
  } = useForm<UpdateProfileInput>({
    defaultValues: {
      id: profile.id,
      name: profile.name,
      title: profile.title,
      bio: profile.bio,
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
          <Avatar className="size-24 text-2xl">
            <AvatarImage src={profile.image ?? undefined} />
            <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
          </Avatar>

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
