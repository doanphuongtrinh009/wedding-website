"use client";

import { useReducedMotion, m } from "framer-motion";
import { Clock3, ShieldCheck, Sparkles, Star } from "lucide-react";

import { fadeUp, motionTimings, staggerContainer } from "@/components/motion/variants";

const trustItems = [
  {
    title: "Verified atelier",
    detail: "Consultations led by trained bridal stylists.",
    icon: ShieldCheck
  },
  {
    title: "4.9 client rating",
    detail: "Consistently praised private fitting service.",
    icon: Star
  },
  {
    title: "Timeline reliability",
    detail: "Clear fitting and alteration milestones.",
    icon: Clock3
  },
  {
    title: "Couture-level finish",
    detail: "Quality checks before every final pickup.",
    icon: Sparkles
  }
] as const;

export function TrustBadges() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.section
      className="section-shell pt-0"
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={staggerContainer(motionTimings.stagger, 0.1)}
    >
      <div className="bg-card/82 rounded-[1.5rem] border border-border/70 p-4 shadow-editorial sm:p-5">
        <m.p className="editorial-kicker mb-3" variants={fadeUp}>
          Why brides book with us
        </m.p>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {trustItems.map((item) => (
            <m.div
              key={item.title}
              variants={fadeUp}
              className="rounded-xl border border-border/70 bg-background/75 p-4 transition-colors hover:border-brand-taupe/30"
            >
              <div className="mb-2 inline-flex size-8 items-center justify-center rounded-full border border-border/70 bg-card">
                <item.icon className="size-4 text-primary" aria-hidden="true" />
              </div>
              <p className="font-semibold text-foreground">{item.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.detail}
              </p>
            </m.div>
          ))}
        </div>
      </div>
    </m.section>
  );
}
