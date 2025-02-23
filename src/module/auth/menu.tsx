import { Button } from "@/components/ui/button";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { DashboardRoute } from "../dashboard/route";
import { AuthRoute } from "./route";

export async function AuthMenu() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex items-center gap-2">
      {!!session && (
        <DashboardRoute.Index.Link>
          <Button>Dashboard</Button>
        </DashboardRoute.Index.Link>
      )}

      {!session && (
        <>
          <AuthRoute.SignIn.Link>
            <Button>Sign in</Button>
          </AuthRoute.SignIn.Link>
          <AuthRoute.SignUp.Link>
            <Button>Sign up for free</Button>
          </AuthRoute.SignUp.Link>
        </>
      )}
    </div>
  );
}
