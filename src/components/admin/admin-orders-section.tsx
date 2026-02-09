import { OrderStatus, PaymentStatus } from "@prisma/client";

import { updateOrderAction } from "@/actions/admin-actions";
import {
  getCustomerName,
  getOrderVariant
} from "@/components/admin/admin-helpers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, formatDate, formatEnumLabel } from "@/lib/format";
import type { AdminOrder } from "@/lib/admin";

const orderStatusOptions = Object.values(OrderStatus);
const paymentStatusOptions = Object.values(PaymentStatus);

type AdminOrdersSectionProps = {
  orders: AdminOrder[];
};

export function AdminOrdersSection({ orders }: AdminOrdersSectionProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Manage orders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {orders.length === 0 ? (
          <p className="rounded-xl border border-border/70 bg-background/70 p-5 text-sm text-muted-foreground">
            No orders found.
          </p>
        ) : (
          orders.map((order) => (
            <form
              key={order.id}
              action={updateOrderAction}
              className="space-y-3 rounded-xl border border-border/70 bg-background/70 p-4"
            >
              <input type="hidden" name="orderId" value={order.id} />

              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium">
                    #{order.orderNumber.slice(0, 12).toUpperCase()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getCustomerName(order.customer)}
                  </p>
                </div>
                <Badge variant={getOrderVariant(order.status)}>
                  {formatEnumLabel(order.status)}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                Total {formatCurrency(order.totalInCents, order.currency)} |
                Items {order._count.items} | Created{" "}
                {formatDate(order.createdAt)}
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor={`order-status-${order.id}`}>
                    Order status
                  </Label>
                  <Select
                    id={`order-status-${order.id}`}
                    name="status"
                    defaultValue={order.status}
                  >
                    {orderStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {formatEnumLabel(status)}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`payment-status-${order.id}`}>
                    Payment status
                  </Label>
                  <Select
                    id={`payment-status-${order.id}`}
                    name="paymentStatus"
                    defaultValue={order.paymentStatus}
                  >
                    {paymentStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {formatEnumLabel(status)}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor={`order-note-${order.id}`}>Notes</Label>
                <Textarea
                  id={`order-note-${order.id}`}
                  name="notes"
                  defaultValue={order.notes ?? ""}
                  className="min-h-20"
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" size="sm">
                  Update order
                </Button>
              </div>
            </form>
          ))
        )}
      </CardContent>
    </Card>
  );
}
