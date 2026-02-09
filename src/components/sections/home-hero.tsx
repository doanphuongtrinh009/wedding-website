"use client";

import { m, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import {
  fadeUp,
  motionTimings,
  staggerContainer
} from "@/components/motion/variants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


export function HomeHero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.section
      className="section-shell relative grid gap-8 overflow-hidden pb-space-xl md:grid-cols-[1.08fr_0.92fr] md:items-end md:gap-10"
      variants={staggerContainer(motionTimings.stagger, 0.04)}
      initial={shouldReduceMotion ? false : "hidden"}
      animate="visible"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <m.div
          className="relative h-full w-full"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        >
          <Image
            src="/images/bridal/hero-banner.png"
            alt="Luxury bridal boutique interior"
            fill
            className="object-cover opacity-20"
            priority
            sizes="100vw"
          />
        </m.div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>



      <div
        className="luxe-orb -left-24 -top-20 size-56 bg-brand-blush/45 blur-3xl md:size-72"
        aria-hidden="true"
      />
      <div
        className="luxe-orb right-8 top-10 hidden size-40 bg-brand-rose/20 blur-3xl md:block"
        aria-hidden="true"
      />

      <m.div
        className="relative z-10 space-y-6 md:space-y-7"
        variants={staggerContainer(0.08)}
      >
        <m.div className="flex flex-wrap items-center gap-3" variants={fadeUp}>
          <Badge variant="secondary">Maison Etoile 2026</Badge>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-brand-taupe">
            Private showroom experience
          </p>
        </m.div>

        <m.h1 className="max-w-3xl" variants={fadeUp}>
          Bridal pieces shaped with couture precision and a quietly modern
          spirit.
        </m.h1>

        <m.p className="max-w-2xl text-muted-foreground" variants={fadeUp}>
          A luxury bridal house blending editorial taste with intimate service.
          Discover refined silhouettes, private fittings, and meticulous
          alteration pathways designed around your timeline.
        </m.p>

        <m.div
          className="flex flex-col gap-3 sm:flex-row sm:items-center"
          variants={fadeUp}
        >
          <Button asChild size="lg">
            <Link href="/book">Reserve private fitting</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/collections">Browse collections</Link>
          </Button>
        </m.div>

        <m.dl
          className="grid grid-cols-1 gap-2 pt-2 text-sm text-muted-foreground sm:grid-cols-3 sm:gap-3"
          variants={fadeUp}
        >
          <div className="rounded-xl border border-border/70 bg-background/75 px-4 py-3">
            <dt className="text-[0.7rem] uppercase tracking-[0.18em] text-brand-taupe">
              Appointments
            </dt>
            <dd className="pt-1 font-medium text-foreground">
              1:1 stylist only
            </dd>
          </div>
          <div className="rounded-xl border border-border/70 bg-background/75 px-4 py-3">
            <dt className="text-[0.7rem] uppercase tracking-[0.18em] text-brand-taupe">
              Alterations
            </dt>
            <dd className="pt-1 font-medium text-foreground">
              Milestone tracked
            </dd>
          </div>
          <div className="rounded-xl border border-border/70 bg-background/75 px-4 py-3">
            <dt className="text-[0.7rem] uppercase tracking-[0.18em] text-brand-taupe">
              Lead time
            </dt>
            <dd className="pt-1 font-medium text-foreground">4-6 months</dd>
          </div>
        </m.dl>
      </m.div>

      <m.div
        className="relative z-10 space-y-4 rounded-[1.6rem] border border-border/75 bg-[linear-gradient(160deg,rgba(255,255,255,0.96)_0%,rgba(253,246,240,0.92)_100%)] p-6 shadow-luxury md:p-8"
        variants={fadeUp}
      >
        <p className="editorial-kicker">Client experience</p>
        <h2 className="text-[2rem] md:text-[2.9rem]">
          One bride, one stylist, full focus.
        </h2>
        <p className="text-sm text-muted-foreground md:text-base">
          Every appointment is paced around body fit, textile education, and
          styling confidence for ceremony, reception, and post-ceremony moments.
        </p>

        <dl className="grid grid-cols-2 gap-3 pt-2 text-sm">
          <div className="rounded-xl border border-border/70 bg-background/75 p-4">
            <dt className="text-muted-foreground">Fitting length</dt>
            <dd className="pt-1 font-medium">90 minutes</dd>
          </div>
          <div className="rounded-xl border border-border/70 bg-background/75 p-4">
            <dt className="text-muted-foreground">Showroom cadence</dt>
            <dd className="pt-1 font-medium">By appointment</dd>
          </div>
        </dl>
      </m.div>
    </m.section>
  );
}
