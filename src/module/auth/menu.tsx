import { Button } from "@/components/ui/button"
import { auth } from "@/system/auth"
import { DashboardPage, SignInPage, SignUpPage } from "@/system/route"

export async function AuthMenu() {
  const session = await auth()

  return (
    <div className="flex items-center gap-2">
      {!!session && (
        <DashboardPage.Link>
          <Button>Dashboard</Button>
        </DashboardPage.Link>
      )}

      {!session && (
        <>
          <SignInPage.Link>
            <Button>Sign in</Button>
          </SignInPage.Link>
          <SignUpPage.Link>
            <Button>Sign up for free</Button>
          </SignUpPage.Link>
        </>
      )}
    </div>
  )
}
