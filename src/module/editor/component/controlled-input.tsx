import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react"
import {
  type Control,
  type FieldValues,
  type Path,
  useController,
} from "react-hook-form"

const inputVariants = cva("relative flex flex-col gap-2", {
  variants: {
    variant: {
      default: "",
      column: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const labelVariants = cva("", {
  variants: {
    variant: {
      default: "vertical-center absolute right-full pr-4 text-center",
      column: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

type ControlledProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  label: string
} & VariantProps<typeof inputVariants>
export function ControlledInput<T extends FieldValues>({
  control,
  name,
  label,
  variant,
  className,
  ...props
}: ControlledProps<T> & InputHTMLAttributes<HTMLInputElement>) {
  const {
    field,
    formState: { errors },
  } = useController({
    name,
    control,
  })

  return (
    <label className={cn(inputVariants({ variant }), className)}>
      <p className={cn(labelVariants({ variant }))}>{label}</p>
      <Input {...field} {...props} />
      {!!errors[name] && (
        <span className="vertical-center absolute left-full w-3/4 px-3 pt-1 text-red-500">
          {errors[name]?.message as string}
        </span>
      )}
    </label>
  )
}

export function ControlledTextarea<T extends FieldValues>({
  control,
  name,
  label,
  variant,
  className,
  ...props
}: ControlledProps<T> & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const {
    field,
    formState: { errors },
  } = useController({
    name,
    control,
  })

  return (
    <label className={cn(inputVariants({ variant }), className)}>
      <p className={cn(labelVariants({ variant }))}>{label}</p>
      <Textarea {...field} {...props} />
      {!!errors[name] && (
        <span className="vertical-center absolute left-full w-3/4 px-3 pt-1 text-red-500">
          {errors[name]?.message as string}
        </span>
      )}
    </label>
  )
}
