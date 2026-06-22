import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { CanteenCardSkeleton } from "@/components/ui/LoadingSkeleton";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export const metadata: Metadata = { title: "Doormato — Order Food" };
export const revalidate = 3600;

const CANTEEN_IMAGES: Record<string, string> = {
  "SKM Canteen": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop",
  "GJBC Canteen": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
  "BE Block 13th Floor": "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop",
  "Hornbill Canteen": "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&h=600&fit=crop",
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop";

async function CanteenGrid() {
  const canteens = await db.canteen.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {canteens.map((canteen, i) => (
        <AnimatedSection key={canteen.id} delay={i * 0.1}>
          <Link
            href={`/doormato/menu/${canteen.id}`}
            className="glass rounded-2xl overflow-hidden card-hover group block"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={canteen.imageUrl ?? CANTEEN_IMAGES[canteen.name] ?? DEFAULT_IMAGE}
                alt={canteen.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-2xl font-bold text-white mb-1">{canteen.name}</h3>
                {canteen.location && (
                  <p className="text-gray-200 text-sm">📍 {canteen.location}</p>
                )}
              </div>
            </div>
            <div className="p-6">
              {canteen.description && (
                <p className="text-gray-300 mb-4">{canteen.description}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-blue-400 font-semibold group-hover:translate-x-1 transition-transform inline-block">
                  View Menu →
                </span>
                <div className="flex items-center gap-1 text-yellow-400">
                  <span>★</span>
                  <span className="text-white text-sm font-semibold">4.5</span>
                </div>
              </div>
            </div>
          </Link>
        </AnimatedSection>
      ))}
    </div>
  );
}

export default function DoormatolPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">🍔 Doormato</h1>
          <p className="text-xl text-gray-300">Order delicious food from campus canteens</p>
        </div>
        <Link
          href="/doormato/my-orders"
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white
                     font-bold rounded-xl transition-all transform hover:scale-105"
        >
          <span>📦</span>
          <span className="hidden sm:block">My Orders</span>
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => <CanteenCardSkeleton key={i} />)}
          </div>
        }
      >
        <CanteenGrid />
      </Suspense>
    </div>
  );
}
