// Edge Runtime — only imports edge-safe modules.
// lib/auth.config does NOT import Prisma or any Node.js-only package.
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

const CUSTOMER_PROTECTED = [
  "/dashboard",
  "/doormato",
  "/scootigo",
  "/expense-tracker",
  "/notifications",
  "/profile",
];

const ADMIN_PROTECTED = [
  "/admin/dashboard",
  "/admin/doormato",
  "/admin/scootigo",
  "/admin/profile",
];

const AUTH_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/admin/login",
  "/admin/register",
];

export default auth((req: NextRequest & { auth?: { user?: { role?: string } } | null }) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const user = session?.user;

  // Authenticated customer visits auth pages → dashboard
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r)) && user?.role === "CUSTOMER") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Authenticated admin visits auth pages → admin dashboard
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r)) && user?.role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  // Customer protected routes
  if (CUSTOMER_PROTECTED.some((r) => pathname.startsWith(r))) {
    if (!user) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (user.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }

  // Admin protected routes
  if (ADMIN_PROTECTED.some((r) => pathname.startsWith(r))) {
    if (!user) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/|api/auth).*)",
  ],
};
