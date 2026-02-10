import { getTranslations } from "next-intl/server";
import { CalendarDays, Gem, Scissors } from "lucide-react";

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

export async function HomeHighlights() {
  const t = await getTranslations("HomeHighlights");

  return (
    <section className="section-shell pt-0">
      <div className="mb-space-md max-w-3xl space-y-4">
        <p className="editorial-kicker">{t("kicker")}</p>
        <h2>{t("heading")}</h2>
        <p className="text-muted-foreground">{t("intro")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 md:gap-6">
        {highlightItems.map((item) => (
          <div key={item.key} className="h-full">
            <Card
              variant="editorial"
              className="group flex h-full flex-col bg-card/75 transition-colors hover:bg-card/95"
            >
              <CardHeader className="pb-3">
                <div className="inline-flex size-10 items-center justify-center rounded-full border border-border/70 bg-background/85 transition-transform duration-500 group-hover:scale-110">
                  <item.icon className="size-4 text-primary" aria-hidden="true" />
                </div>
                <CardTitle className="min-h-[4.7rem] pt-3 text-[1.9rem] leading-tight md:min-h-[5.2rem] md:text-[2.1rem]">
                  {t(`${item.key}Title`)}
                </CardTitle>
                <CardDescription className="min-h-[4.6rem] max-w-prose text-base leading-relaxed text-foreground/85">
                  {t(`${item.key}Desc`)}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-0">
                <p className="min-h-[5.4rem] border-t border-border/60 pt-4 text-sm leading-relaxed text-muted-foreground">
                  {t(`${item.key}Note`)}
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
