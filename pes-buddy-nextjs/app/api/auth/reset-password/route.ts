import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { passwordResetSchema } from "@/lib/validations/auth";

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = passwordResetSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parsed.error.errors },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = parsed.data;

    const user = await db.user.findUnique({ where: { id: session.user.id } });
    if (!user?.password) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.user.update({
      where: { id: session.user.id },
      data: { password: hashed },
    });

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("[Auth/ResetPassword]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
