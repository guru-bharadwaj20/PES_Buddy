import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/layout/AdminNav";

export const metadata: Metadata = { title: "Admin | PES Buddy" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="min-h-screen flex flex-col">
      <AdminNav />
      <main className="flex-1 pt-20">{children}</main>
    </div>
  );
}
