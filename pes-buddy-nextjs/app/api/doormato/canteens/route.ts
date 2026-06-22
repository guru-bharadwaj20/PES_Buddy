import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cache } from "@/lib/redis";

export async function GET() {
  try {
    // Try cache first (canteens rarely change)
    const cached = await cache.get<unknown[]>("canteens:all");
    if (cached) return NextResponse.json(cached);

    const canteens = await db.canteen.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });

    await cache.set("canteens:all", canteens, 3600); // 1 hour
    return NextResponse.json(canteens);
  } catch (err) {
    console.error("[Doormato/Canteens]", err);
    return NextResponse.json({ message: "Failed to fetch canteens" }, { status: 500 });
  }
}
