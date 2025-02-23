import { Input } from "@/components/ui/input";
import { InputHTMLAttributes } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";

type ControlledInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
} & InputHTMLAttributes<HTMLInputElement>;
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
  });

  return (
    <label className="flex flex-col gap-2 mb-12 relative">
      <p className="absolute right-full vertical-center pr-4 text-center">
        {label}
      </p>
      <Input {...field} {...props} />
      {!!errors[name] && (
        <span className="px-3 pt-1 absolute left-full w-3/4 vertical-center text-red-500">
          {errors[name]?.message as string}
        </span>
      )}
    </label>
  );
}
