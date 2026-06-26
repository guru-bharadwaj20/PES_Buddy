// Node.js only — never imported from middleware or Edge Runtime code.
// All Prisma and bcrypt usage lives here.
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { authConfig } from "@/lib/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  // Override the stub providers from authConfig with real implementations.
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
  events: {
    async createUser({ user }) {
      if (user.id) {
        await db.user.update({
          where: { id: user.id },
          data: { role: "CUSTOMER" },
        });
      }
    },
  },
});

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }
  return user;
}
