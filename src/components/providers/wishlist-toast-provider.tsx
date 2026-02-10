"use client";

import { ToastProvider } from "@/components/ui/toast-system";

export function WishlistToastProvider({
  children
}: {
  children: React.ReactNode;
}) {
  return <ToastProvider>{children}</ToastProvider>;
}
