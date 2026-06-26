import type { NextAuthConfig } from "next-auth";
import type { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

// Module augmentation lives here so it is available in both the
// edge-safe config (middleware) and the full Node.js auth config.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      srn: string;
      role: string;
    } & DefaultSession["user"];
  }
  interface User {
    srn?: string;
    role?: string;
  }
}

// Edge-safe configuration — no Prisma, no bcrypt, no Node.js-only APIs.
// Used by middleware for lightweight JWT verification.
// The full server-side auth (with PrismaAdapter and real authorize()) is in lib/auth.ts.
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  // Stub providers — authorize() is never called in middleware.
  // The actual credential verification runs in lib/auth.ts (Node.js only).
  providers: [
    CredentialsProvider({
      id: "credentials",
      credentials: {
        srn: {},
        password: {},
        isAdmin: {},
      },
      async authorize() {
        return null;
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.srn = (user as { srn?: string }).srn;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.srn = token.srn as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};
