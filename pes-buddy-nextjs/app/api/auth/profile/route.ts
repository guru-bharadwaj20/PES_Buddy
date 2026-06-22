import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profileUpdateSchema } from "@/lib/validations/auth";

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = profileUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parsed.error.errors },
        { status: 400 }
      );
    }

    const { name, email } = parsed.data;

    // Check email uniqueness if provided
    if (email) {
      const existing = await db.user.findFirst({
        where: { email, id: { not: session.user.id } },
      });
      if (existing) {
        return NextResponse.json(
          { message: "Email already in use" },
          { status: 400 }
        );
      }
    }

    const user = await db.user.update({
      where: { id: session.user.id },
      data: {
        ...(name && { name }),
        ...(email !== undefined && { email: email || null }),
      },
      select: { id: true, name: true, srn: true, email: true, role: true },
    });

    return NextResponse.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("[Auth/Profile]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
