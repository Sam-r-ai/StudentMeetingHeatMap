"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthProvider({children}: {children: React.ReactNode}) {
  const { data: session } = useSession();
  if (session && session.user?.email?.endsWith("csuchico.edu")) {
    return (
      <>
        {children}
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
