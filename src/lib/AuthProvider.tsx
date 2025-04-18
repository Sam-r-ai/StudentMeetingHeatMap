"use client";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const allowedPaths = ["/signedout"];

  useEffect(() => {
    if (status === "loading") return;
    if (!session || !session.user?.email?.endsWith("csuchico.edu")) {
      router.push("/signedout");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "authenticated" || allowedPaths.includes(pathname)) {
    return <>{children}</>;
  }
}
