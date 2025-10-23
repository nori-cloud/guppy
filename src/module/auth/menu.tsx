import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/auth-action"
import { DashboardPage, SignInPage } from "@/system/route"
import { SignIn } from "./component"

export async function AuthMenu() {
  const session = await getSession()

  return (
    <div className="flex items-center gap-2">
      {!!session && (
        <DashboardPage.Link>
          <Button>Dashboard</Button>
        </DashboardPage.Link>
      )}

      {!session && <SignIn />}
    </div>
  )
}
