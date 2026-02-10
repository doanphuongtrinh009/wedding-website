"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { usePathname } from "@/i18n/routing";

import { pageFadeRise } from "@/components/motion/variants";

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={pathname}
        variants={pageFadeRise}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-full"
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
}
