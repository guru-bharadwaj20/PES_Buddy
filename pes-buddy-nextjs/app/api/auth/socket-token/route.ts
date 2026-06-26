import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import jwt from "jsonwebtoken";

// Returns a short-lived JWT for Socket.IO authentication.
// The Socket.IO server (server.ts) verifies this with the same NEXTAUTH_SECRET.
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = jwt.sign(
    { sub: session.user.id, id: session.user.id },
    process.env.NEXTAUTH_SECRET ?? "secret",
    { expiresIn: "1h" }
  );

  return NextResponse.json({ token });
}
