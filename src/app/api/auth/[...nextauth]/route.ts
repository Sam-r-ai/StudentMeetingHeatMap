// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const runtime = "nodejs"; // NextAuth v4 expects Node runtime

const authOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  providers: [
    //GoogleProvider({
    //  clientId: process.env.GOOGLE_ID!,
    //  clientSecret: process.env.GOOGLE_SECRET!,
    //}),
  ],
} satisfies import("next-auth").NextAuthOptions;

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
