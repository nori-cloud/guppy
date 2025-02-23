import { OAuthButton } from "@/module/auth/components/client";
import { DashboardRoute } from "@/module/dashboard/route";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { getProviders } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect(DashboardRoute.Index.Url);
  }

  const rawProviders = (await getProviders()) ?? [];

  const providers = Object.values(rawProviders).map((provider) => ({
    id: provider.id,
    name: provider.name,
  }));

  return (
    <div className="flex flex-col items-center mt-[25dvh] max-w-md mx-auto h-screen">
      <h1 className="text-4xl font-bold mb-12">Welcome to Guppy</h1>

      <div className="flex flex-col gap-4 w-full">
        {Object.values(providers).map((provider) => (
          <OAuthButton key={provider.id} provider={provider.id} />
        ))}
      </div>
    </div>
  );
}
