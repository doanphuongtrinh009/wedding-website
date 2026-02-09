import { UserRole } from "@prisma/client";

import { updateCustomerRoleAction } from "@/actions/admin-actions";
import { getCustomerName } from "@/components/admin/admin-helpers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { formatEnumLabel } from "@/lib/format";
import type { AdminCustomer } from "@/lib/admin";

const roleOptions = Object.values(UserRole);

type AdminCustomersSectionProps = {
  customers: AdminCustomer[];
};

export function AdminCustomersSection({
  customers
}: AdminCustomersSectionProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Manage customers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {customers.length === 0 ? (
          <p className="rounded-xl border border-border/70 bg-background/70 p-5 text-sm text-muted-foreground">
            No customers found.
          </p>
        ) : (
          customers.map((customer) => (
            <form
              key={customer.id}
              action={updateCustomerRoleAction}
              className="space-y-3 rounded-xl border border-border/70 bg-background/70 p-4"
            >
              <input type="hidden" name="customerId" value={customer.id} />

              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{getCustomerName(customer)}</p>
                  <p className="text-xs text-muted-foreground">
                    {customer.email}
                  </p>
                </div>
                <Badge
                  variant={
                    customer.role === UserRole.ADMIN ? "default" : "outline"
                  }
                >
                  {formatEnumLabel(customer.role)}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                Orders {customer._count.orders} | Bookings{" "}
                {customer._count.bookings} | Wishlist{" "}
                {customer._count.wishlistItems}
              </p>

              <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="space-y-1">
                  <Label htmlFor={`role-${customer.id}`}>Role</Label>
                  <Select
                    id={`role-${customer.id}`}
                    name="role"
                    defaultValue={customer.role}
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {formatEnumLabel(role)}
                      </option>
                    ))}
                  </Select>
                </div>

                <Button type="submit" size="sm">
                  Update role
                </Button>
              </div>
            </form>
          ))
        )}
      </CardContent>
    </Card>
  );
}
