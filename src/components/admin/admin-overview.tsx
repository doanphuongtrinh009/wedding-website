import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";

type AdminOverviewProps = {
  stats: {
    totalDresses: number;
    activeDresses: number;
    totalBookings: number;
    pendingBookings: number;
    totalOrders: number;
    paidOrders: number;
    totalCustomers: number;
    totalRevenueInCents: number;
    monthlyRevenueInCents: number;
    averageOrderValueInCents: number;
    currency: string;
  };
};

export function AdminOverview({ stats }: AdminOverviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <Card variant="editorial">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Total revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-display text-4xl">
            {formatCurrency(stats.totalRevenueInCents, stats.currency)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            AOV {formatCurrency(stats.averageOrderValueInCents, stats.currency)}
          </p>
        </CardContent>
      </Card>

      <Card variant="editorial">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Monthly revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-display text-4xl">
            {formatCurrency(stats.monthlyRevenueInCents, stats.currency)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Paid orders {stats.paidOrders}
          </p>
        </CardContent>
      </Card>

      <Card variant="editorial">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Dresses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-display text-4xl">{stats.totalDresses}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Active {stats.activeDresses}
          </p>
        </CardContent>
      </Card>

      <Card variant="editorial">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-display text-4xl">{stats.totalBookings}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Open {stats.pendingBookings}
          </p>
        </CardContent>
      </Card>

      <Card variant="editorial">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-display text-4xl">{stats.totalCustomers}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Orders {stats.totalOrders}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
