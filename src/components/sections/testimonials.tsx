"use client";

import { useReducedMotion, m } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { fadeUp, motionTimings, staggerContainer } from "@/components/motion/variants";

const testimonials = [
  {
    quote:
      "The stylist understood my ceremony vision immediately. The booking process was clear, and every fitting was perfectly paced.",
    name: "Linh T.",
    event: "Garden Ceremony"
  },
  {
    quote:
      "I shortlisted dresses online, booked in one click, and found my gown in the first appointment. The service felt truly private.",
    name: "Emily R.",
    event: "City Wedding"
  },
  {
    quote:
      "From first message to final alteration, communication was fast and professional. I always knew exactly what was next.",
    name: "Gia N.",
    event: "Destination Wedding"
  }
] as const;

export function Testimonials() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.section
      className="section-shell pt-0"
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={staggerContainer(motionTimings.stagger, 0.1)}
    >
      <m.div className="mb-6 space-y-3" variants={fadeUp}>
        <p className="editorial-kicker">Client testimonials</p>
        <h2 className="max-w-2xl">Booked with confidence, loved in person.</h2>
      </m.div>

      <div className="grid gap-4 md:grid-cols-3 md:gap-5">
        {testimonials.map((testimonial) => (
          <m.div key={testimonial.name} variants={fadeUp}>
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
                <p className="text-base text-foreground">“{testimonial.quote}”</p>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.event}
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
