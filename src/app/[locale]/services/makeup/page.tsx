import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2, Clock3, MessageCircle, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";

const packageKeys = ["trial", "weddingDay", "premium"] as const;
const processKeys = ["step1", "step2", "step3"] as const;
const includedKeys = ["item1", "item2", "item3"] as const;
const excludedKeys = ["item1", "item2", "item3"] as const;

const galleryItems = [
  { key: "look1", src: "/images/products/slip-1.png" },
  { key: "look2", src: "/images/products/details/slip-1-detail-bodice.png" },
  { key: "look3", src: "/images/bridal/boutique-interior.png" }
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("MakeupServicePage");

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: "/services/makeup"
    }
  };
}

export default async function MakeupServicePage() {
  const t = await getTranslations("MakeupServicePage");

  return (
    <section className="section-shell space-y-7">
      <div className="soft-frame overflow-hidden bg-[linear-gradient(160deg,rgba(255,255,255,0.95)_0%,rgba(250,241,234,0.9)_100%)] p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div className="space-y-4">
            <p className="editorial-kicker">{t("kicker")}</p>
            <h1>{t("heading")}</h1>
            <p className="text-muted-foreground">{t("description")}</p>

            <div className="grid gap-2 sm:grid-cols-3">
              {(["priceFrom", "serviceType", "responseTime"] as const).map((stat) => (
                <div
                  key={stat}
                  className="rounded-xl border border-border/70 bg-background/75 px-3 py-3"
                >
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-brand-taupe">
                    {t(`stats.${stat}.label`)}
                  </p>
                  <p className="pt-1 font-semibold text-foreground">
                    {t(`stats.${stat}.value`)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                asChild
                className="h-11 rounded-2xl border border-brand-cocoa/10 bg-[linear-gradient(135deg,hsl(var(--brand-cocoa))_12%,hsl(var(--primary))_100%)] px-5 text-[0.76rem] font-semibold normal-case tracking-[0.03em]"
              >
                <Link href="/book?services=makeup">{t("ctas.bookOnly")}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-2xl border-border/80 bg-background/80 px-5 text-[0.76rem] font-semibold normal-case tracking-[0.03em]"
              >
                <Link href="/book?services=makeup,photo">{t("ctas.bookBundle")}</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="h-11 rounded-2xl px-4 text-[0.76rem] font-semibold normal-case tracking-[0.03em]"
              >
                <Link href="/services">{t("ctas.backServices")}</Link>
              </Button>
            </div>
          </div>

          <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-border/70 bg-secondary/35">
            <Image
              src="/images/products/slip-1.png"
              alt={t("heroImageAlt")}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
              priority
            />
          </div>
        </div>
      </div>

      <Card variant="editorial" className="soft-frame bg-card/86">
        <CardHeader className="pb-2">
          <CardTitle>{t("packageTitle")}</CardTitle>
          <p className="text-sm text-muted-foreground">{t("packageNote")}</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 lg:grid-cols-3">
            {packageKeys.map((pkg) => (
              <div
                key={pkg}
                className="rounded-xl border border-border/70 bg-background/75 p-4"
              >
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-brand-taupe">
                  {t(`packages.${pkg}.label`)}
                </p>
                <p className="pt-1 text-xl font-semibold text-foreground">
                  {t(`packages.${pkg}.name`)}
                </p>
                <p className="pt-2 font-display text-[1.85rem] leading-none text-brand-cocoa">
                  {t(`packages.${pkg}.price`)}
                </p>
                <p className="pt-2 text-sm text-muted-foreground">
                  {t(`packages.${pkg}.desc`)}
                </p>
                <div className="mt-3 space-y-2">
                  {(["feature1", "feature2", "feature3"] as const).map((feature) => (
                    <p key={feature} className="flex items-start gap-2 text-sm text-foreground/90">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                      <span>{t(`packages.${pkg}.${feature}`)}</span>
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card variant="elevated" className="soft-frame bg-card/90">
        <CardHeader className="pb-2">
          <CardTitle>{t("galleryTitle")}</CardTitle>
          <p className="text-sm text-muted-foreground">{t("galleryIntro")}</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {galleryItems.map((item) => (
              <figure key={item.key} className="space-y-2">
                <div className="relative aspect-4/5 overflow-hidden rounded-xl border border-border/70 bg-secondary/30">
                  <Image
                    src={item.src}
                    alt={t(`gallery.${item.key}.alt`)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <figcaption className="text-sm text-muted-foreground">
                  {t(`gallery.${item.key}.caption`)}
                </figcaption>
              </figure>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card variant="editorial" className="soft-frame bg-card/84">
          <CardHeader>
            <CardTitle>{t("processTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {processKeys.map((step, index) => (
              <div
                key={step}
                className="rounded-xl border border-border/70 bg-background/70 p-4"
              >
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-brand-taupe">
                  {t("stepLabel", { index: index + 1 })}
                </p>
                <p className="pt-1 font-semibold text-foreground">
                  {t(`process.${step}.title`)}
                </p>
                <p className="pt-1 text-sm text-muted-foreground">
                  {t(`process.${step}.detail`)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card variant="editorial" className="soft-frame bg-card/84">
          <CardHeader>
            <CardTitle>{t("scopeTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-border/70 bg-background/70 p-4">
              <p className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                <Sparkles className="size-4 text-primary" aria-hidden="true" />
                <span>{t("scopeIncluded")}</span>
              </p>
              <div className="space-y-1.5">
                {includedKeys.map((item) => (
                  <p key={item} className="text-sm text-muted-foreground">
                    - {t(`includedItems.${item}`)}
                  </p>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border/70 bg-background/70 p-4">
              <p className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                <Clock3 className="size-4 text-primary" aria-hidden="true" />
                <span>{t("scopeExcluded")}</span>
              </p>
              <div className="space-y-1.5">
                {excludedKeys.map((item) => (
                  <p key={item} className="text-sm text-muted-foreground">
                    - {t(`excludedItems.${item}`)}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card variant="elevated" className="soft-frame bg-card/88">
        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="font-semibold text-foreground">{t("supportTitle")}</p>
            <p className="text-sm text-muted-foreground">{t("supportDesc")}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <a
              href={siteConfig.support.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border/80 bg-background/75 px-4 text-[0.74rem] font-semibold normal-case tracking-[0.03em] text-foreground transition hover:border-brand-taupe/45 hover:bg-card/95"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              <span>{t("supportCtas.whatsapp")}</span>
            </a>
            <a
              href={siteConfig.support.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border/80 bg-background/75 px-4 text-[0.74rem] font-semibold normal-case tracking-[0.03em] text-foreground transition hover:border-brand-taupe/45 hover:bg-card/95"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              <span>{t("supportCtas.zalo")}</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
