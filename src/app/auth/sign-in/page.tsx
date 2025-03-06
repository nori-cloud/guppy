import { Button } from "@/components/ui/button"
import { signIn } from "@/system/auth"
import { SignInPage } from "@/system/route"

export const metadata = SignInPage.Metadata

export default async function Page() {
  return (
    <div className="mx-auto mt-[25dvh] flex h-screen max-w-md flex-col items-center">
      <h1 className="mb-12 text-4xl font-bold">Welcome to Guppy</h1>

      <div className="flex flex-col gap-4">
        <form
          className="w-full"
          action={async () => {
            "use server"
            await signIn("github")
          }}
        >
          <Button type="submit">Signin with GitHub</Button>
        </form>
        <form
          className="w-full"
          action={async () => {
            "use server"
            await signIn("discord")
          }}
        >
          <Button type="submit">Signin with Discord</Button>
        </form>
      </div>
    </div>
  )
}
