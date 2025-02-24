import { Button } from "@/components/ui/button";
import { signIn } from "@/system/auth";

export default async function Page() {
  return (
    <div className="flex flex-col items-center mt-[25dvh] max-w-md mx-auto h-screen">
      <h1 className="text-4xl font-bold mb-12">Welcome to Guppy</h1>

      <div className="flex flex-col gap-4">
        <form
          className="w-full"
          action={async () => {
            "use server";
            await signIn("github");
          }}
        >
          <Button type="submit">Signin with GitHub</Button>
        </form>
        <form
          className="w-full"
          action={async () => {
            "use server";
            await signIn("discord");
          }}
        >
          <Button type="submit">Signin with Discord</Button>
        </form>
      </div>
    </div>
  );
}
