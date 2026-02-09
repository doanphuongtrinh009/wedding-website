import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, CheckCircle2, Scissors } from "lucide-react";

import { createTryOnBookingAction } from "@/actions/shop-actions";
import { BookingRequestForm } from "@/components/shop/booking-request-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { getBookableProducts } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Book Try-On Appointment",
  description:
    "Request a private bridal try-on appointment with your preferred gown."
};

function getSingleSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

const errorCopy: Record<string, string> = {
  "invalid-form": "Please complete all required fields.",
  "invalid-datetime": "Choose a future appointment date and time.",
  "invalid-product":
    "Selected product is unavailable. Please choose another gown.",
  "service-unavailable":
    "Booking service is temporarily unavailable. Please try again shortly.",
  "slot-unavailable":
    "That time slot has been reserved. Please choose a different appointment time."
};

const experienceSteps = [
  {
    title: "Stylist preparation",
    detail: "Your style notes are reviewed ahead of the showroom appointment.",
    icon: Scissors
  },
  {
    title: "Private fitting",
    detail:
      "Try-on session tailored to silhouette, fit, and ceremony timeline.",
    icon: CalendarClock
  },
  {
    title: "Aftercare planning",
    detail: "Alteration milestones and pickup timeline are confirmed with you.",
    icon: CheckCircle2
  }
] as const;

export default async function BookingPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const products = await getBookableProducts();

  const selectedProductId = getSingleSearchParam(params.productId) ?? "";
  const error = getSingleSearchParam(params.error);

  return (
    <section className="section-shell relative overflow-hidden">
      <div
        className="luxe-orb -right-24 top-10 size-56 bg-brand-blush/35 blur-3xl md:size-72"
        aria-hidden="true"
      />

      <div className="relative z-10 mb-space-lg max-w-2xl space-y-4">
        <p className="editorial-kicker">Try-On Booking</p>
        <h1>Reserve your private bridal appointment.</h1>
        <p className="text-muted-foreground">
          Choose a date, share your event timeline, and we will confirm your
          fitting request with stylist prep notes.
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
            <CardTitle>Appointment request form</CardTitle>
          </CardHeader>
          <CardContent>
            <BookingRequestForm
              action={createTryOnBookingAction}
              products={products}
              selectedProductId={selectedProductId}
            />
          </CardContent>
        </Card>

        <Card variant="editorial" className="soft-frame bg-card/82">
          <CardHeader>
            <CardTitle>Service timeline</CardTitle>
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
                We send confirmation details with stylist prep guidance after
                reviewing your preferred date and notes.
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              For account tracking and wishlist sync, please{" "}
              <Link
                href="/sign-in"
                className="font-semibold text-foreground underline-offset-4 hover:underline"
              >
                sign in
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
                WhatsApp support
              </a>
              <a
                href={siteConfig.support.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-border/80 bg-card/85 px-4 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.13em] text-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-safe:hover:-translate-y-0.5"
              >
                Zalo support
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
