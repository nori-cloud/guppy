import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { SignOutButton } from "./sign-out-button";

export default async function Page() {
  const session = await getServerSession(authOptions);

  console.log("session", session);

  return (
    <div className="max-w-5xl mx-auto h-screen">
      <h1>Dashboard</h1>

      <p>Welcome {session?.user?.name}</p>
      <pre className="p-4 rounded-md overflow-y-auto">
        {JSON.stringify(session, null, 2)}
      </pre>

      <SignOutButton />
    </div>
  );
}
