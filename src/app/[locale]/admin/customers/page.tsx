import type { Metadata } from "next";

import { AdminCustomersSection } from "@/components/admin/admin-customers-section";
import { getAdminCustomers } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Manage Customers"
};

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return <AdminCustomersSection customers={customers} />;
}
