import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatDateTime } from "@/lib/format";
import { requireUserProfile } from "@/lib/auth";
import { getAccountOverview } from "@/lib/shop";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "Account" });

  return {
    title: t("heading"),
    robots: {
      index: false,
      follow: false
    }
  };
}

function getStatusBadgeVariant(
  status: string
): "default" | "secondary" | "outline" {
  if (status === "PENDING") {
    return "secondary";
  }

  if (status === "CONFIRMED") {
    return "default";
  }

  return "outline";
}

export default async function AccountPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const t = await getTranslations("Account");
  const statusT = await getTranslations("Status");
  const params = await searchParams;
  const profile = await requireUserProfile();
  const overview = await getAccountOverview(profile.id);

  const bookingCreated =
    (Array.isArray(params.booking) ? params.booking[0] : params.booking) ===
    "created";

  return (
    <section className="section-shell">
      <div className="mb-space-lg space-y-4">
        <p className="editorial-kicker">{t("kicker")}</p>
        <h1>{t("heading")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      {bookingCreated ? (
        <div
          className="mb-5 rounded-xl border border-primary/35 bg-primary/10 p-4 text-sm text-primary"
          role="status"
          aria-live="polite"
        >
          {t("bookingCreated")}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card variant="editorial">
          <CardHeader>
            <CardTitle>{t("profile")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                {t("email")}
              </p>
              <p className="font-medium">{profile.email}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                {t("name")}
              </p>
              <p className="font-medium">
                {[profile.firstName, profile.lastName]
                  .filter(Boolean)
                  .join(" ") || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                {t("phone")}
              </p>
              <p className="font-medium">{profile.phone || "—"}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-xl border border-border/70 bg-background/70 p-4">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  {t("upcomingBookings")}
                </p>
                <p className="font-display text-3xl leading-none">
                  {overview.upcomingBookings}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  {t("wishlistItems")}
                </p>
                <p className="font-display text-3xl leading-none">
                  {overview.wishlistCount}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button asChild>
                <Link href="/book">{t("bookTryOn")}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/wishlist">{t("openWishlist")}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>{t("recentBookings")}</CardTitle>
          </CardHeader>
          <CardContent>
            {overview.bookings.length === 0 ? (
              <div className="rounded-xl border border-border/70 bg-background/65 p-5">
                <p className="font-medium">{t("noBookings")}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("noBookingsNote")}
                </p>
                <Button asChild className="mt-4">
                  <Link href="/book">{t("bookNow")}</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {overview.bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-xl border border-border/70 bg-background/65 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-medium">
                        #{booking.bookingNumber.slice(0, 8).toUpperCase()}
                      </p>
                      <Badge variant={getStatusBadgeVariant(booking.status)}>
                        {statusT(booking.status)}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t("appointment")}: {formatDateTime(booking.appointmentAt)}
                    </p>
                    {booking.product ? (
                      <p className="text-sm text-muted-foreground">
                        {t("product")}:{" "}
                        <Link href={`/collections/${booking.product.slug}`}>
                          {booking.product.name}
                        </Link>
                      </p>
                    ) : null}
                    {booking.eventDate ? (
                      <p className="text-sm text-muted-foreground">
                        {t("weddingDate")}: {formatDate(booking.eventDate)}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
