import NextAuth, { type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

// Extend session types
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

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "SRN & Password",
      credentials: {
        srn: { label: "SRN", type: "text" },
        password: { label: "Password", type: "password" },
        isAdmin: { label: "Is Admin", type: "text" },
      },
      async authorize(credentials) {
        const { srn, password, isAdmin } = credentials as {
          srn: string;
          password: string;
          isAdmin: string;
        };

        if (!srn || !password) return null;

        const user = await db.user.findUnique({ where: { srn } });
        if (!user || !user.password) return null;

        // Role-based login separation
        if (isAdmin === "true" && user.role !== "ADMIN") return null;
        if (isAdmin !== "true" && user.role === "ADMIN") return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email ?? undefined,
          srn: user.srn,
          role: user.role,
        };
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
        token.srn = user.srn;
        token.role = user.role;
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
  events: {
    async createUser({ user }) {
      // Set default role for Google OAuth users
      if (user.id) {
        await db.user.update({
          where: { id: user.id },
          data: { role: "CUSTOMER" },
        });
      }
    },
  },
});

// Server-side helper to get current user
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

// Check if user is admin
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }
  return user;
}
