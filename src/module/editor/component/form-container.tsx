import React from "react"

type FormContainerProps = {
  errorMessage?: string
  children: React.ReactNode
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export function FormContainer({ errorMessage, ...props }: FormContainerProps) {
  return (
    <form className="flex w-full flex-col" onSubmit={props.onSubmit}>
      {!!errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {props.children}
    </form>
  )
}
