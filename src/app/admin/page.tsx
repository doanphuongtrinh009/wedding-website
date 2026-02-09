import type { Metadata } from "next";
import Link from "next/link";

import { AdminOverview } from "@/components/admin/admin-overview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminSummaryStats } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Admin Overview"
};

export default async function AdminPage() {
  const stats = await getAdminSummaryStats();

  return (
    <div className="space-y-6">
      <AdminOverview stats={stats} />

      <Card variant="editorial">
        <CardHeader>
          <CardTitle>Management areas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/admin/dresses">Manage dresses</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/bookings">Manage bookings</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/orders">Manage orders</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/customers">Manage customers</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
