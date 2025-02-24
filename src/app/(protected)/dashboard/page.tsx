import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProfile } from "@/db/profile";
import { getCurrentUser } from "@/db/user";
import { DashboardRoute } from "@/module/dashboard/route";
import { signOut } from "@/system/auth";
import { revalidatePath } from "next/cache";

export default async function Page() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <>wooo, something is really wrong</>;
  }

  return (
    <div className="max-w-5xl mx-auto h-screen">
      <h1>Dashboard</h1>

      <p>Welcome {currentUser.name}</p>

      <pre className="p-4 rounded-md overflow-y-auto">
        {JSON.stringify(currentUser, null, 2)}
      </pre>

      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button type="submit">Sign out</Button>
      </form>

      {currentUser.profiles.length === 0 && (
        <CreateProfileForm userId={currentUser.id} />
      )}
    </div>
  );
}

function CreateProfileForm({ userId }: { userId: string }) {
  async function action() {
    "use server";

    await createProfile(userId, {
      name: "test",
    });

    revalidatePath(DashboardRoute.Index.Url);
  }

  return (
    <form action={action}>
      <p>{"Look like you don't have a profile yet"}</p>
      <p>Create one now!</p>

      <Input name="name" placeholder="Profile name" />

      <Button type="submit">Create profile</Button>
    </form>
  );
}
