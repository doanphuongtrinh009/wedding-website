import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { CalendarClock, CheckCircle2, Scissors } from "lucide-react";

import { createTryOnBookingAction } from "@/actions/shop-actions";
import { BookingRequestForm } from "@/components/shop/booking-request-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { getBookableProducts } from "@/lib/shop";

type ServiceCode = "makeup" | "photo";

const supportedServiceCodes = new Set<string>(["makeup", "photo"]);

function isServiceCode(value: string): value is ServiceCode {
  return supportedServiceCodes.has(value);
}

export const metadata: Metadata = {
  title: "Book Try-On Appointment",
  description:
    "Request a private bridal try-on appointment with your preferred gown."
};

function getSingleSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseServiceCodes(paramValue: string | undefined): ServiceCode[] {
  if (!paramValue) {
    return [];
  }

  const parsed = paramValue
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter((item): item is ServiceCode => isServiceCode(item));

  return Array.from(new Set(parsed));
}

export default async function BookingPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [t, params, products] = await Promise.all([
    getTranslations("Booking"),
    searchParams,
    getBookableProducts()
  ]);

  const selectedProductId = getSingleSearchParam(params.productId) ?? "";
  const selectedServices = parseServiceCodes(
    getSingleSearchParam(params.services)
  );
  const error = getSingleSearchParam(params.error);

  const errorCopy: Record<string, string> = {
    "invalid-form": t("errors.invalidForm"),
    "invalid-datetime": t("errors.invalidDatetime"),
    "invalid-product": t("errors.invalidProduct"),
    "service-unavailable": t("errors.serviceUnavailable"),
    "slot-unavailable": t("errors.slotUnavailable")
  };

  const experienceSteps = [
    {
      title: t("steps.stylistPrep.title"),
      detail: t("steps.stylistPrep.detail"),
      icon: Scissors
    },
    {
      title: t("steps.privateFitting.title"),
      detail: t("steps.privateFitting.detail"),
      icon: CalendarClock
    },
    {
      title: t("steps.aftercare.title"),
      detail: t("steps.aftercare.detail"),
      icon: CheckCircle2
    }
  ] as const;

  return (
    <section className="section-shell relative overflow-hidden">
      <div
        className="luxe-orb -right-24 top-10 size-56 bg-brand-blush/35 blur-3xl md:size-72"
        aria-hidden="true"
      />

      <div className="relative z-10 mb-space-lg max-w-2xl space-y-4">
        <p className="editorial-kicker">{t("kicker")}</p>
        <h1>{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
        <p className="inline-flex rounded-full border border-border/70 bg-card/80 px-3 py-1.5 text-xs text-muted-foreground">
          {t("serviceOnlyHint")}
        </p>
      </div>

      {error && errorCopy[error] ? (
        <div
          className="relative z-10 mb-6 rounded-2xl border border-destructive/35 bg-destructive/10 p-4 text-sm text-destructive shadow-sm"
          role="alert"
          aria-live="assertive"
        >
          {errorCopy[error]}
        </div>
      ) : null}

      <div className="relative z-10 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <Card
          variant="elevated"
          className="soft-frame bg-[linear-gradient(155deg,rgba(255,255,255,0.95)_0%,rgba(252,246,241,0.9)_100%)]"
        >
          <CardHeader>
            <CardTitle>{t("formTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <BookingRequestForm
              action={createTryOnBookingAction}
              products={products}
              selectedProductId={selectedProductId}
              selectedServices={selectedServices}
            />
          </CardContent>
        </Card>

        <Card variant="editorial" className="soft-frame bg-card/82">
          <CardHeader>
            <CardTitle>{t("timelineTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {experienceSteps.map((step) => (
              <div
                key={step.title}
                className="bg-background/68 rounded-xl border border-border/70 p-4"
              >
                <step.icon
                  className="mb-3 size-4 text-primary"
                  aria-hidden="true"
                />
                <p className="font-medium">{step.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {step.detail}
                </p>
              </div>
            ))}

            <div className="rounded-xl border border-border/70 bg-background/70 p-4">
              <p className="text-sm text-muted-foreground">
                {t("confirmationNote")}
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              {t("signInPrompt")}{" "}
              <Link
                href="/sign-in"
                className="font-semibold text-foreground underline-offset-4 hover:underline"
              >
                {t("signInLink")}
              </Link>
              .
            </p>

            <div className="grid gap-2 sm:grid-cols-2">
              <a
                href={siteConfig.support.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-border/80 bg-card/85 px-4 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.13em] text-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-safe:hover:-translate-y-0.5"
              >
                {t("supportButtons.whatsapp")}
              </a>
              <a
                href={siteConfig.support.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-border/80 bg-card/85 px-4 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.13em] text-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-safe:hover:-translate-y-0.5"
              >
                {t("supportButtons.zalo")}
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
