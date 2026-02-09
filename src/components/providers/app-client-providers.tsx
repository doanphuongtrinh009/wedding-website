"use client";

import { MotionProvider } from "@/components/motion/provider";
import { ToastProvider } from "@/components/ui/toast-system";

export function AppClientProviders({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <MotionProvider>
      <ToastProvider>{children}</ToastProvider>
    </MotionProvider>
  );
}
