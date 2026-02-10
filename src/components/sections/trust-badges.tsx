import { getTranslations } from "next-intl/server";
import { Clock3, ShieldCheck, Sparkles, Star } from "lucide-react";

const trustItems = [
  {
    key: "verified",
    icon: ShieldCheck
  },
  {
    key: "rating",
    icon: Star
  },
  {
    key: "timeline",
    icon: Clock3
  },
  {
    key: "finish",
    icon: Sparkles
  }
] as const;

export async function TrustBadges() {
  const t = await getTranslations("TrustBadges");

  return (
    <section className="section-shell pt-0">
      <div className="bg-card/82 rounded-[1.5rem] border border-border/70 p-4 shadow-editorial sm:p-5">
        <p className="editorial-kicker mb-3">{t("kicker")}</p>
        <div className="grid auto-rows-fr gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {trustItems.map((item) => (
            <div
              key={item.key}
              className="flex h-full flex-col rounded-xl border border-border/70 bg-background/75 p-4 transition-colors hover:border-brand-taupe/30"
            >
              <div className="mb-2 inline-flex size-8 items-center justify-center rounded-full border border-border/70 bg-card">
                <item.icon className="size-4 text-primary" aria-hidden="true" />
              </div>
              <p className="min-h-[3rem] font-semibold leading-snug text-foreground">
                {t(`items.${item.key}.title`)}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {t(`items.${item.key}.detail`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
