import { BookingStatus } from "@/generated/prisma/browser";

import { updateBookingAction } from "@/actions/admin-actions";
import {
  getBookingVariant,
  getCustomerName
} from "@/components/admin/admin-helpers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, formatDateTime, formatEnumLabel } from "@/lib/format";
import type { AdminBooking } from "@/lib/admin";

const bookingStatusOptions = Object.values(BookingStatus);

type AdminBookingsSectionProps = {
  bookings: AdminBooking[];
};

export function AdminBookingsSection({ bookings }: AdminBookingsSectionProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Manage bookings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {bookings.length === 0 ? (
          <p className="rounded-xl border border-border/70 bg-background/70 p-5 text-sm text-muted-foreground">
            No bookings found.
          </p>
        ) : (
          bookings.map((booking) => (
            <form
              key={booking.id}
              action={updateBookingAction}
              className="space-y-3 rounded-xl border border-border/70 bg-background/70 p-4"
            >
              <input type="hidden" name="bookingId" value={booking.id} />

              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium">
                    #{booking.bookingNumber.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getCustomerName(booking.customer)}
                  </p>
                </div>
                <Badge variant={getBookingVariant(booking.status)}>
                  {formatEnumLabel(booking.status)}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                Appointment {formatDateTime(booking.appointmentAt)} (
                {booking.durationInMinutes} min, {booking.appointmentTimeZone})
              </p>
              {booking.eventDate ? (
                <p className="text-sm text-muted-foreground">
                  Wedding date {formatDate(booking.eventDate)}
                </p>
              ) : null}
              {booking.product ? (
                <p className="text-sm text-muted-foreground">
                  Dress {booking.product.name}
                </p>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor={`booking-status-${booking.id}`}>Status</Label>
                  <Select
                    id={`booking-status-${booking.id}`}
                    name="status"
                    defaultValue={booking.status}
                  >
                    {bookingStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {formatEnumLabel(status)}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`booking-note-${booking.id}`}>
                    Internal notes
                  </Label>
                  <Textarea
                    id={`booking-note-${booking.id}`}
                    name="internalNotes"
                    defaultValue={booking.internalNotes ?? ""}
                    className="min-h-20"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" size="sm">
                  Update booking
                </Button>
              </div>
            </form>
          ))
        )}
      </CardContent>
    </Card>
  );
}
