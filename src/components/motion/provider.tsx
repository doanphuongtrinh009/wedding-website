"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";

import { motionEase, motionTimings } from "@/components/motion/variants";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: motionTimings.base, ease: motionEase }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
