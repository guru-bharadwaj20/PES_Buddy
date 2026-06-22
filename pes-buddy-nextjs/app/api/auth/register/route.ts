import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: parsed.error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    const { name, srn, email, password, role } = parsed.data;

    const existingSrn = await db.user.findUnique({ where: { srn } });
    if (existingSrn) {
      return NextResponse.json(
        { message: "User with this SRN already exists" },
        { status: 400 }
      );
    }

    if (email) {
      const existingEmail = await db.user.findUnique({ where: { email } });
      if (existingEmail) {
        return NextResponse.json(
          { message: "Email already registered" },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name,
        srn,
        email: email || null,
        password: hashedPassword,
        role,
      },
      select: { id: true, name: true, srn: true, email: true, role: true, createdAt: true },
    });

    return NextResponse.json(
      { message: "Registration successful", user },
      { status: 201 }
    );
  } catch (err) {
    console.error("[Auth/Register]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
