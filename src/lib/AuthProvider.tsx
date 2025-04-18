"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session || !session.user?.email?.endsWith("csuchico.edu")) {
      router.push("/signedout");
    }
  }, [session, router]);

  return <>{children}</>;
}
