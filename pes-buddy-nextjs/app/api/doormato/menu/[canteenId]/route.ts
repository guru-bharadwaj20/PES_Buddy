import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cache } from "@/lib/redis";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ canteenId: string }> }
) {
  const { canteenId } = await params;

  try {
    const cacheKey = `menu:${canteenId}`;
    const cached = await cache.get<unknown[]>(cacheKey);
    if (cached) return NextResponse.json(cached);

    const items = await db.menuItem.findMany({
      where: { canteenId },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    await cache.set(cacheKey, items, 600); // 10 min
    return NextResponse.json(items);
  } catch (err) {
    console.error("[Doormato/Menu]", err);
    return NextResponse.json({ message: "Failed to fetch menu" }, { status: 500 });
  }
}
