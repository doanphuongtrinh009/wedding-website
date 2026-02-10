"use client";

import { CalendarCheck2, MessageCircle, PhoneCall } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const hiddenRoutePrefixes = ["/admin", "/sign-in", "/sign-up"];

export function FloatingConversionCta() {
  const pathname = usePathname();
  const t = useTranslations("FloatingCta");
  const isBookingPage = pathname.startsWith("/book");

  if (hiddenRoutePrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  return (
    <aside className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:inset-x-auto md:bottom-6 md:right-6 md:max-w-sm md:px-0 md:pb-0">
      <div className="bg-background/92 pointer-events-auto rounded-2xl border border-border/70 p-2 shadow-luxury backdrop-blur md:hidden">
        <div className="flex items-center gap-2">
          {!isBookingPage ? (
            <Button asChild className="h-11 flex-1 px-4 text-[0.68rem]">
              <Link href="/book">
                <CalendarCheck2 className="size-4" aria-hidden="true" />
                {t("bookFitting")}
              </Link>
            </Button>
          ) : null}

          <a
            href={siteConfig.support.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="inline-flex size-11 items-center justify-center rounded-full border border-border/80 bg-card/85 text-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-safe:hover:-translate-y-0.5"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
          </a>

          <a
            href={siteConfig.support.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on Zalo"
            className="inline-flex size-11 items-center justify-center rounded-full border border-border/80 bg-card/85 text-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-safe:hover:-translate-y-0.5"
          >
            <PhoneCall className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="bg-background/94 pointer-events-auto hidden w-72 space-y-2 rounded-2xl border border-border/70 p-3 shadow-luxury backdrop-blur md:block">
        {!isBookingPage ? (
          <Button asChild className="h-11 w-full text-[0.68rem]">
            <Link href="/book">
              <CalendarCheck2 className="size-4" aria-hidden="true" />
              {t("reserveFitting")}
            </Link>
          </Button>
        ) : null}

        <div className="grid grid-cols-2 gap-2">
          <a
            href={siteConfig.support.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border/80 bg-card/85 px-3 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.13em] text-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-safe:hover:-translate-y-0.5"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            WhatsApp
          </a>
          <a
            href={siteConfig.support.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border/80 bg-card/85 px-3 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.13em] text-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-safe:hover:-translate-y-0.5"
          >
            <PhoneCall className="size-4" aria-hidden="true" />
            Zalo
          </a>
        </div>
      </div>
    </aside>
  );
}
