import { Icon } from "@/components/ui/icon"
import { useEffect, useRef, useState } from "react"

interface EditableInputProps {
  defaultValue: string
  onSave?: (value: string) => void
  className?: string
  placeholder?: string
}

export default function EditableInput({
  defaultValue = "",
  onSave,
  className = "",
  placeholder = "Click to edit",
}: EditableInputProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(defaultValue)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Focus input element when entering edit mode
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  // Update value if defaultValue changes externally
  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  const handleClick = () => {
    if (!isEditing) {
      setIsEditing(true)
    }
  }

  const handleBlur = () => {
    setIsEditing(false)
    // Call the onSave callback if provided
    if (onSave && value !== defaultValue) {
      onSave(value)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBlur()
    } else if (e.key === "Escape") {
      setValue(defaultValue) // Reset to original value
      setIsEditing(false)
    }
  }

  return (
    <div
      className={`relative w-full transition-all ${
        isEditing && "shadow-[0_1px_0_0_var(--color-background)]"
      } ${className}`}
      onClick={handleClick}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full rounded-md focus:outline-none"
        />
      ) : (
        <div className="group flex cursor-pointer items-center">
          {value || <span className="text-foreground/30">{placeholder}</span>}
          <Icon
            icon="edit"
            className="ml-2 inline-block size-3 opacity-0 group-hover:opacity-100"
          />
        </div>
      )}
    </div>
  )
}
