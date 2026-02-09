"use client";

import { m } from "framer-motion";
import { CalendarDays, Gem, Scissors } from "lucide-react";

import {
  fadeUp,
  motionTimings,
  staggerContainer
} from "@/components/motion/variants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

const highlights = [
  {
    title: "Couture curation",
    description:
      "Small-batch designer edits selected for balance, movement, and photography quality.",
    icon: Gem
  },
  {
    title: "Fitting discipline",
    description:
      "Milestone-based alterations with timeline checkpoints before the wedding week.",
    icon: Scissors
  },
  {
    title: "Calendar planning",
    description:
      "Appointment timing mapped from engagement to ceremony day handoff.",
    icon: CalendarDays
  }
] as const;

export function HomeHighlights() {
  return (
    <m.section
      className="section-shell grid gap-4 pt-0 md:grid-cols-3 md:gap-6"
      variants={staggerContainer(motionTimings.stagger, 0.2)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {highlights.map((item) => (
        <m.div key={item.title} variants={fadeUp}>
          <Card
            variant="editorial"
            className="group h-full bg-card/75 transition-colors hover:bg-card/95"
          >
            <CardHeader className="pb-3">
              <div className="inline-flex size-10 items-center justify-center rounded-full border border-border/70 bg-background/85 transition-transform duration-500 group-hover:scale-110">
                <item.icon className="size-4 text-primary" aria-hidden="true" />
              </div>
              <CardTitle className="pt-3 text-[1.9rem] md:text-[2.1rem]">
                {item.title}
              </CardTitle>
              <CardDescription className="max-w-prose">
                {item.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">
                Built for premium service consistency across styling, inventory,
                and client communication.
              </p>
            </CardContent>
          </Card>
        </m.div>
      ))}
    </m.section>
  );
}
