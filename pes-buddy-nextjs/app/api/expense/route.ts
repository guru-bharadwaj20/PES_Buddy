import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { addExpenseSchema } from "@/lib/validations/expense";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = addExpenseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parsed.error.errors },
        { status: 400 }
      );
    }

    const { description, category, amount, date } = parsed.data;

    const expense = await db.expense.create({
      data: {
        userId: session.user.id,
        category,
        amount,
        note: description,
        date: date ? new Date(date) : new Date(),
      },
    });

    // Create notification
    await db.notification.create({
      data: {
        userId: session.user.id,
        type: "EXPENSE",
        title: "Expense Added",
        message: `New ${category} expense of ₹${amount.toFixed(2)} has been recorded.`,
        relatedId: expense.id,
        icon: "💰",
      },
    });

    // Emit Socket.IO to user's private room
    const io = (globalThis as Record<string, unknown>).__io as import("socket.io").Server | undefined;
    if (io) {
      io.to(`user:${session.user.id}`).emit("expense:added", {
        expenseId: expense.id,
        category: expense.category,
        amount: expense.amount,
        timestamp: new Date(),
      });
    }

    return NextResponse.json({ ...expense, description: expense.note }, { status: 201 });
  } catch (err) {
    console.error("[Expense/Add]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const expenses = await db.expense.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
    });

    const mapped = expenses.map((e) => ({ ...e, description: e.note ?? "" }));
    return NextResponse.json(mapped);
  } catch (err) {
    console.error("[Expense/Get]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ message: "Expense ID required" }, { status: 400 });

    await db.expense.deleteMany({
      where: { id, userId: session.user.id },
    });

    return NextResponse.json({ message: "Expense deleted" });
  } catch (err) {
    console.error("[Expense/Delete]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
