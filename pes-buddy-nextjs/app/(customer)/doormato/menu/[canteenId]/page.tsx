import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { db } from "@/lib/db";
import { MenuPageClient } from "@/features/doormato/MenuPageClient";

type Props = { params: Promise<{ canteenId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { canteenId } = await params;
  const canteen = await db.canteen.findUnique({ where: { id: canteenId } });
  return { title: canteen ? `${canteen.name} Menu` : "Menu" };
}

export default async function MenuPage({ params }: Props) {
  const { canteenId } = await params;

  const [canteen, menuItems] = await Promise.all([
    db.canteen.findUnique({ where: { id: canteenId } }),
    db.menuItem.findMany({
      where: { canteenId },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    }),
  ]);

  if (!canteen) notFound();

  // Group by category
  const grouped = menuItems.reduce<Record<string, typeof menuItems>>((acc, item) => {
    const cat = item.category ?? "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Canteen header */}
      <div className="glass rounded-2xl overflow-hidden mb-8">
        <div className="relative h-48">
          <Image
            src={canteen.imageUrl ?? "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=400&fit=crop"}
            alt={canteen.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <h1 className="text-3xl font-bold text-white">{canteen.name}</h1>
            {canteen.location && (
              <p className="text-gray-200">📍 {canteen.location}</p>
            )}
          </div>
        </div>
      </div>

      <MenuPageClient
        canteen={{ id: canteen.id, name: canteen.name }}
        grouped={grouped}
      />
    </div>
  );
}
