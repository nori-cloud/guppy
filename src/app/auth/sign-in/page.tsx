import { getProviders } from "@/lib/auth"
import { SignInPage } from "@/system/route"
import { SignInWithProvider } from "@/module/auth/component"

export const metadata = SignInPage.Metadata

export default function Page() {
  const providers = getProviders()

  return (
    <div className="mx-auto mt-[25dvh] flex h-screen max-w-md flex-col items-center">
      <h1 className="mb-12 text-4xl font-bold">Welcome to Guppy</h1>

      <SignInWithProvider providers={providers} />
    </div>
  )
}
