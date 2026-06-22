import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const CUSTOMER_PROTECTED = [
  "/dashboard",
  "/doormato",
  "/scootigo",
  "/expense-tracker",
  "/notifications",
  "/profile",
];

// Routes that require admin role
const ADMIN_PROTECTED = [
  "/admin/dashboard",
  "/admin/doormato",
  "/admin/scootigo",
  "/admin/profile",
];

// Routes that redirect when already logged in
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

  // If authenticated customer visits auth pages → redirect to dashboard
  if (
    AUTH_ROUTES.some((r) => pathname.startsWith(r)) &&
    user?.role === "CUSTOMER"
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // If authenticated admin visits auth pages → redirect to admin dashboard
  if (
    AUTH_ROUTES.some((r) => pathname.startsWith(r)) &&
    user?.role === "ADMIN"
  ) {
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
