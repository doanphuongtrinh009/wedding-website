"use client";

import { useReducedMotion, m } from "framer-motion";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { fadeUp, motionTimings, staggerContainer } from "@/components/motion/variants";

const testimonials = [
  {
    key: "linh",
    name: "Linh T."
  },
  {
    key: "emily",
    name: "Emily R."
  },
  {
    key: "gia",
    name: "Gia N."
  }
] as const;

export function Testimonials() {
  const shouldReduceMotion = useReducedMotion();
  const t = useTranslations("Testimonials");

  return (
    <m.section
      className="section-shell pt-0"
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={staggerContainer(motionTimings.stagger, 0.1)}
    >
      <m.div className="mb-6 space-y-3" variants={fadeUp}>
        <p className="editorial-kicker">{t("kicker")}</p>
        <h2 className="max-w-2xl">{t("heading")}</h2>
      </m.div>

      <div className="grid gap-4 md:grid-cols-3 md:gap-5">
        {testimonials.map((testimonial) => (
          <m.div key={testimonial.key} variants={fadeUp}>
            <Card
              variant="editorial"
              className="bg-card/86"
            >
              <CardHeader className="pb-2">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-brand-taupe">
                  ★★★★★
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base text-foreground">
                  “{t(`reviews.${testimonial.key}.quote`)}”
                </p>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t(`reviews.${testimonial.key}.event`)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </m.div>
        ))}
      </div>
    </m.section>
  );
}
