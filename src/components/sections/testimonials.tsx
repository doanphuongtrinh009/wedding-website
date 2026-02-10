import { getTranslations } from "next-intl/server";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

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

export async function Testimonials() {
  const t = await getTranslations("Testimonials");

  return (
    <section className="section-shell pt-0">
      <div className="mb-6 space-y-3">
        <p className="editorial-kicker">{t("kicker")}</p>
        <h2 className="max-w-2xl">{t("heading")}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3 md:gap-5">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.key} variant="editorial" className="bg-card/86">
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
        ))}
      </div>
    </section>
  );
}
