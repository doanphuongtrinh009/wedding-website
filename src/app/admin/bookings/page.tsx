import type { Metadata } from "next";

import { AdminBookingsSection } from "@/components/admin/admin-bookings-section";
import { getAdminBookings } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Manage Bookings"
};

export default async function AdminBookingsPage() {
  const bookings = await getAdminBookings();

  return <AdminBookingsSection bookings={bookings} />;
}
