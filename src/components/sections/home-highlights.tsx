"use client";

import { m } from "framer-motion";
import { useTranslations } from "next-intl";
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

const highlightItems = [
  {
    key: "couture",
    icon: Gem
  },
  {
    key: "fitting",
    icon: Scissors
  },
  {
    key: "calendar",
    icon: CalendarDays
  }
] as const;

export function HomeHighlights() {
  const t = useTranslations("HomeHighlights");

  return (
    <m.section
      className="section-shell grid gap-4 pt-0 md:grid-cols-3 md:gap-6"
      variants={staggerContainer(motionTimings.stagger, 0.2)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {highlightItems.map((item) => (
        <m.div key={item.key} variants={fadeUp}>
          <Card
            variant="editorial"
            className="group h-full bg-card/75 transition-colors hover:bg-card/95"
          >
            <CardHeader className="pb-3">
              <div className="inline-flex size-10 items-center justify-center rounded-full border border-border/70 bg-background/85 transition-transform duration-500 group-hover:scale-110">
                <item.icon className="size-4 text-primary" aria-hidden="true" />
              </div>
              <CardTitle className="pt-3 text-[1.9rem] md:text-[2.1rem]">
                {t(`${item.key}Title`)}
              </CardTitle>
              <CardDescription className="max-w-prose">
                {t(`${item.key}Desc`)}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">{t("footerText")}</p>
            </CardContent>
          </Card>
        </m.div>
      ))}
    </m.section>
  );
}
