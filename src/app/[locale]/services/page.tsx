import type { Metadata } from "next";
import { Camera, Gem, CalendarClock, Sparkles, CheckCircle2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ServiceKey = "dress" | "makeup" | "photo";

const serviceKeys: ServiceKey[] = ["dress", "makeup", "photo"];

const serviceIconMap = {
  dress: Gem,
  makeup: Sparkles,
  photo: Camera
} as const;

const serviceHrefMap = {
  dress: "/collections",
  makeup: "/services/makeup",
  photo: "/services/photo"
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ServicesPage");

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: "/services"
    }
  };
}

export default async function ServicesPage() {
  const t = await getTranslations("ServicesPage");

  return (
    <section className="section-shell">
      <div className="soft-frame relative overflow-hidden bg-[linear-gradient(160deg,rgba(255,255,255,0.95)_0%,rgba(247,238,230,0.88)_100%)] p-6 md:p-9">
        <div
          className="luxe-orb -right-24 top-0 size-56 bg-brand-blush/40 blur-3xl md:size-72"
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-3xl space-y-4">
          <p className="editorial-kicker">{t("kicker")}</p>
          <h1>{t("heading")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        <div className="relative z-10 mt-6 grid gap-3 sm:grid-cols-3">
          {(["serviceLines", "oneToOne", "serviceOnly"] as const).map((stat) => (
            <div
              key={stat}
              className="rounded-xl border border-border/65 bg-background/75 p-4"
            >
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.13em] text-brand-taupe">
                {t(`stats.${stat}.label`)}
              </p>
              <p className="mt-1 font-display text-3xl leading-tight text-foreground">
                {t(`stats.${stat}.value`)}
              </p>
            </div>
          ))}
        </div>

        <div className="relative z-10 mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            className="h-12 rounded-2xl border border-brand-cocoa/10 bg-[linear-gradient(135deg,hsl(var(--brand-cocoa))_12%,hsl(var(--primary))_100%)] text-[0.78rem] font-semibold normal-case tracking-[0.04em]"
          >
            <Link href="/book?services=makeup,photo">{t("heroPrimaryCta")}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 rounded-2xl border-border/80 bg-background/75 text-[0.78rem] font-semibold normal-case tracking-[0.04em]"
          >
            <Link href="/collections">{t("heroSecondaryCta")}</Link>
          </Button>
        </div>
      </div>

      <div className="mt-space-lg grid gap-4 md:grid-cols-3">
        {serviceKeys.map((serviceKey) => {
          const Icon = serviceIconMap[serviceKey];

          return (
            <Card
              key={serviceKey}
              variant="editorial"
              className="group flex h-full flex-col bg-card/88"
            >
              <CardHeader className="space-y-3 pb-2">
                <div className="inline-flex size-10 items-center justify-center rounded-full border border-border/70 bg-background/85">
                  <Icon className="size-4 text-primary" aria-hidden="true" />
                </div>
                <CardTitle className="text-[2rem] leading-tight md:text-[2.2rem]">
                  {t(`cards.${serviceKey}.title`)}
                </CardTitle>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(`cards.${serviceKey}.summary`)}
                </p>
              </CardHeader>

              <CardContent className="mt-auto space-y-2 pt-0">
                {(["point1", "point2", "point3"] as const).map((point) => (
                  <p
                    key={point}
                    className="flex items-start gap-2 text-sm text-foreground/90"
                  >
                    <CheckCircle2
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span>{t(`cards.${serviceKey}.${point}`)}</span>
                  </p>
                ))}

                <Button
                  asChild
                  variant="outline"
                  className="mt-4 h-10 rounded-xl border-border/80 bg-background/80 px-3 text-[0.74rem] font-semibold normal-case tracking-[0.03em]"
                >
                  <Link href={serviceHrefMap[serviceKey]}>
                    {t(`cards.${serviceKey}.cta`)}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-space-lg grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card variant="elevated" className="soft-frame bg-card/88">
          <CardHeader>
            <CardTitle>{t("workflow.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(["step1", "step2", "step3"] as const).map((step) => (
              <div
                key={step}
                className="rounded-xl border border-border/70 bg-background/70 p-4"
              >
                <p className="font-semibold text-foreground">
                  {t(`workflow.${step}.title`)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t(`workflow.${step}.detail`)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card variant="editorial" className="soft-frame bg-card/84">
          <CardHeader>
            <CardTitle>{t("serviceOnly.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("serviceOnly.description")}
            </p>
            <div className="rounded-xl border border-border/70 bg-background/70 p-4">
              <div className="flex items-start gap-3">
                <CalendarClock
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <p className="text-sm text-muted-foreground">
                  {t("serviceOnly.note")}
                </p>
              </div>
            </div>
            <Button
              asChild
              className="h-11 rounded-2xl border border-brand-cocoa/10 bg-[linear-gradient(135deg,hsl(var(--brand-cocoa))_12%,hsl(var(--primary))_100%)] text-[0.76rem] font-semibold normal-case tracking-[0.03em]"
            >
              <Link href="/book?services=makeup,photo">
                {t("serviceOnly.cta")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
