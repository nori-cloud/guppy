import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CredentialForm } from "@/module/auth/credential-form";
import { DashboardRoute } from "@/module/dashboard/route";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth/next";
import { getProviders, signIn } from "next-auth/react";
import { authOptions } from "../api/auth/[...nextauth]";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { destination: DashboardRoute.Index.Link } };
  }

  const rawProviders = (await getProviders()) ?? [];

  const providers = Object.values(rawProviders).map((provider) => ({
    id: provider.id,
    name: provider.name,
  }));

  const hasCredentials = !!providers.find((p) => p.id === "credentials");

  return {
    props: {
      hasCredentials,
      providers: providers.filter((p) => p.id !== "credentials"),
    },
  };
}

export default function SignInPage({
  hasCredentials,
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="flex flex-col items-center mt-[25dvh] max-w-md mx-auto h-screen">
      <h1 className="text-4xl font-bold mb-12">Welcome to Guppy</h1>

      <div className="flex flex-col gap-4 w-full">
        {Object.values(providers).map((provider) => (
          <Button key={provider.name} onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </Button>
        ))}
      </div>

      {hasCredentials && (
        <>
          <Separator className="my-12" />
          <CredentialForm />
        </>
      )}
    </div>
  );
}
