"use client";

import { m, useReducedMotion } from "framer-motion";
import { Children } from "react";

import { fadeUp, staggerContainer } from "@/components/motion/variants";
import { cn } from "@/lib/utils";

type MotionStaggerGridProps = {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
};

export function MotionStaggerGrid({
  children,
  className,
  stagger
}: MotionStaggerGridProps) {
  const shouldReduceMotion = useReducedMotion();
  const items = Children.toArray(children);

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={cn(className)}
      variants={staggerContainer(stagger)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.14, margin: "-8% 0px -8% 0px" }}
      style={{ willChange: "opacity, transform" }}
    >
      {items.map((item, index) => (
        <m.div key={index} variants={fadeUp}>
          {item}
        </m.div>
      ))}
    </m.div>
  );
}
