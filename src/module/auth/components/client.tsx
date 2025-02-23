"use client";
import { Button } from "@/components/ui/button";
import { signIn, signOut } from "next-auth/react";

export function SignOutButton() {
  return <Button onClick={() => signOut()}>Sign out</Button>;
}

export function OAuthButton({ provider }: { provider: string }) {
  return (
    <Button onClick={() => signIn(provider)}>Sign in with {provider}</Button>
  );
}
