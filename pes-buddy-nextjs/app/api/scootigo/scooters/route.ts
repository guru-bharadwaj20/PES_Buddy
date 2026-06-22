import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cache } from "@/lib/redis";

export async function GET() {
  try {
    const cached = await cache.get<unknown[]>("scooters:all");
    if (cached) return NextResponse.json(cached);

    const scooters = await db.scooter.findMany({
      where: { maintenance: false },
      orderBy: { scooterId: "asc" },
    });

    await cache.set("scooters:all", scooters, 30); // 30 sec (availability changes fast)
    return NextResponse.json(scooters);
  } catch (err) {
    console.error("[Scootigo/Scooters]", err);
    return NextResponse.json({ message: "Failed to fetch scooters" }, { status: 500 });
  }
}
