import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/system/auth";

export default async function Page() {
  const session = await auth();

  return (
    <div className="max-w-5xl mx-auto h-screen">
      <h1>Dashboard</h1>

      <p>Welcome {session?.user?.name}</p>
      <pre className="p-4 rounded-md overflow-y-auto">
        {JSON.stringify(session, null, 2)}
      </pre>

      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button type="submit">Sign out</Button>
      </form>
    </div>
  );
}
