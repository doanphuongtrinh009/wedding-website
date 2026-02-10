"use client";

import { usePathname } from "@/i18n/routing";
import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  m,
  MotionConfig
} from "framer-motion";

import { motionEase, motionTimings, pageFadeRise } from "@/components/motion/variants";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: motionTimings.base, ease: motionEase }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageFadeRise}
            className="flex min-h-[calc(100vh-64px)] flex-col"
            style={{ willChange: "opacity, transform" }}
          >
            {children}
          </m.div>
        </AnimatePresence>
      </MotionConfig>
    </LazyMotion>
  );
}
