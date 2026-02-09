import { CalendarCheck2, Clock3, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const steps = [
  {
    title: "Style consultation",
    detail: "30-minute discovery call before your in-store fitting.",
    icon: Sparkles
  },
  {
    title: "Private appointment",
    detail: "90-minute showroom session with dedicated bridal stylist.",
    icon: Clock3
  },
  {
    title: "Timeline planning",
    detail: "Alterations and pickup schedule aligned to your wedding date.",
    icon: CalendarCheck2
  }
] as const;

export function BookingFormUI() {
  return (
    <section className="section-shell">
      <div className="mb-space-lg max-w-2xl space-y-4">
        <p className="editorial-kicker">Booking Experience</p>
        <h1>Reserve a private bridal fitting.</h1>
        <p className="text-muted-foreground">
          Share your event details and style direction. Our team will confirm
          your appointment window within 24 business hours.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card variant="elevated" className="soft-frame">
          <CardHeader>
            <CardTitle>Appointment request</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" placeholder="Olivia Hart" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="olivia@email.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" placeholder="(555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weddingDate">Wedding date</Label>
                <Input id="weddingDate" type="date" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="silhouette">Preferred silhouette</Label>
                <Select id="silhouette" defaultValue="">
                  <option value="" disabled>
                    Select one
                  </option>
                  <option>A-Line</option>
                  <option>Ball Gown</option>
                  <option>Fit & Flare</option>
                  <option>Column</option>
                  <option>Undecided</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Estimated gown budget</Label>
                <Select id="budget" defaultValue="">
                  <option value="" disabled>
                    Select range
                  </option>
                  <option>$2,000 - $3,000</option>
                  <option>$3,000 - $4,500</option>
                  <option>$4,500 - $6,000</option>
                  <option>$6,000+</option>
                </Select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Share your venue, ceremony style, and details you want your stylist to prepare for."
                />
              </div>

              <div className="sm:col-span-2">
                <Button type="submit" className="w-full sm:w-auto">
                  Request appointment
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card variant="editorial" className="soft-frame bg-card/85">
          <CardHeader>
            <CardTitle>What happens next</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.title}
                className="rounded-xl border border-border/70 bg-background/60 p-4"
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
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
