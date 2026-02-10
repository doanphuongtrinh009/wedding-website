"use client";

import { m, useReducedMotion } from "framer-motion";

import { motionEase, motionTimings } from "@/components/motion/variants";
import { cn } from "@/lib/utils";

type SectionRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function SectionReveal({
  children,
  className,
  delay = 0
}: SectionRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={cn(className)}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16, margin: "-8% 0px -8% 0px" }}
      transition={{
        duration: motionTimings.base,
        delay,
        ease: motionEase
      }}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </m.div>
  );
}
