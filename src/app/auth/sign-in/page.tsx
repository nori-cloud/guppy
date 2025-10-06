import { Button } from "@/components/ui/button"
import { signIn } from "@/system/auth"
import { getProviders } from "@/system/auth.config"
import { SignInPage } from "@/system/route"

export const metadata = SignInPage.Metadata

export default async function Page() {
  const providers = await getProviders()

  return (
    <div className="mx-auto mt-[25dvh] flex h-screen max-w-md flex-col items-center">
      <h1 className="mb-12 text-4xl font-bold">Welcome to Guppy</h1>

      <div className="flex flex-col gap-4">
        {providers.map((provider, i) => {
          if ("id" in provider) {
            return (
              <form
                key={provider.id}
                className="w-full"
                action={async () => {
                  "use server"
                  await signIn(provider.id)
                }}
              >
                <Button type="submit">{provider.name}</Button>
              </form>
            )
          } else {
            console.error("Provider does not have an id", provider)
            return (
              <div key={`${provider.name}-${i}}`}>
                Provider does not have an id
              </div>
            )
          }
        })}
      </div>
    </div>
  )
}
