import type { Metadata } from "next";

import { AdminDressesSection } from "@/components/admin/admin-dresses-section";
import { getAdminDresses } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Manage Dresses"
};

export default async function AdminDressesPage() {
  const dresses = await getAdminDresses();

  return <AdminDressesSection dresses={dresses} />;
}
