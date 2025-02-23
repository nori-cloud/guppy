import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  if (!session) {
    return <div>Not logged in</div>;
  }

  return (
    <div className="max-w-5xl mx-auto h-screen">
      <h1>Dashboard</h1>

      <p>Welcome {session?.user?.name}</p>
      <pre className="p-4 rounded-md overflow-y-auto">
        {JSON.stringify(session, null, 2)}
      </pre>

      <Button onClick={() => signOut()}>Sign out</Button>
    </div>
  );
}
