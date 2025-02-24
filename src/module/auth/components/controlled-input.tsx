import { Input } from "@/components/ui/input"
import { InputHTMLAttributes } from "react"
import { Control, FieldValues, Path, useController } from "react-hook-form"

type ControlledInputProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  label: string
} & InputHTMLAttributes<HTMLInputElement>
export function ControlledInput<T extends FieldValues>({
  control,
  name,
  label,
  ...props
}: ControlledInputProps<T>) {
  const {
    field,
    formState: { errors },
  } = useController({
    name,
    control,
  })

  return (
    <label className="relative mb-12 flex flex-col gap-2">
      <p className="vertical-center absolute right-full pr-4 text-center">
        {label}
      </p>
      <Input {...field} {...props} />
      {!!errors[name] && (
        <span className="vertical-center absolute left-full w-3/4 px-3 pt-1 text-red-500">
          {errors[name]?.message as string}
        </span>
      )}
    </label>
  )
}
