import type { Metadata } from "next";

import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const profile = await requireAdmin();

  return (
    <section className="section-shell">
      <div className="mb-space-lg space-y-4">
        <p className="editorial-kicker">Admin Dashboard</p>
        <h1>Operations</h1>
        <p className="max-w-2xl text-muted-foreground">
          Signed in as {profile.email}. Manage catalog, appointments, orders,
          and customer profiles.
        </p>
      </div>

      <AdminNav />
      <div className="mt-6">{children}</div>
    </section>
  );
}
