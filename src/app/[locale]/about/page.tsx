import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";

import { Button } from "@/components/ui/button";
import { RealBrides } from "@/components/sections/real-brides";

export default function AboutPage() {
  const t = useTranslations("AboutPage");

  return (
    <>
      <section className="section-shell space-y-16 md:space-y-24">
        {/* Heritage Section */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="editorial-kicker">{t("kicker")}</p>
            <h1 className="text-4xl leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
              {t("heroTitle1")}
              <br className="hidden lg:block" />
              {t("heroTitle2")}
            </h1>
            <p className="max-w-prose text-lg text-muted-foreground leading-relaxed">
              {t("heroDesc1")}
            </p>
            <p className="max-w-prose text-base text-muted-foreground">
              {t("heroDesc2")}
            </p>
            <Button asChild size="lg" className="mt-4">
              <Link href="/book">{t("cta")}</Link>
            </Button>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl md:aspect-square lg:aspect-[4/5]">
            <Image
              src="/images/bridal/boutique-interior.png"
              alt="Quỳnh Trâm Bridal Boutique Interior"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>

        {/* Process Section */}
        <div className="space-y-10 border-t border-border pt-16 md:pt-24">
          <div className="text-center">
            <span className="editorial-kicker mb-3 block">Service</span>
            <h2 className="text-3xl md:text-4xl">{t("processTitle")}</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-3 p-6 rounded-xl bg-secondary/20">
              <div className="mb-4 text-4xl font-display text-muted-foreground/30">01</div>
              <h3 className="text-xl font-medium">{t("steps.consult.title")}</h3>
              <p className="text-muted-foreground">{t("steps.consult.desc")}</p>
            </div>
            <div className="space-y-3 p-6 rounded-xl bg-secondary/20">
              <div className="mb-4 text-4xl font-display text-muted-foreground/30">02</div>
              <h3 className="text-xl font-medium">{t("steps.fitting.title")}</h3>
              <p className="text-muted-foreground">{t("steps.fitting.desc")}</p>
            </div>
            <div className="space-y-3 p-6 rounded-xl bg-secondary/20">
              <div className="mb-4 text-4xl font-display text-muted-foreground/30">03</div>
              <h3 className="text-xl font-medium">{t("steps.alteration.title")}</h3>
              <p className="text-muted-foreground">{t("steps.alteration.desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Real Brides Integration */}
      <RealBrides />
    </>
  );
}
