import type { Metadata } from "next";

import { AdminOrdersSection } from "@/components/admin/admin-orders-section";
import { getAdminOrders } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Manage Orders"
};

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return <AdminOrdersSection orders={orders} />;
}
