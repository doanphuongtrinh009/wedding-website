import { ProductStatus } from "@prisma/client";

import { createDressAction, updateDressAction } from "@/actions/admin-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTime, formatEnumLabel } from "@/lib/format";
import type { AdminDress } from "@/lib/admin";

import { toPriceInputValue } from "./admin-helpers";

const productStatusOptions = Object.values(ProductStatus);

type AdminDressesSectionProps = {
  dresses: AdminDress[];
};

export function AdminDressesSection({ dresses }: AdminDressesSectionProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Manage dresses</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <form
          action={createDressAction}
          className="space-y-4 rounded-xl border border-border/70 bg-background/70 p-4"
        >
          <div className="space-y-2">
            <Label htmlFor="new-dress-name">Name</Label>
            <Input
              id="new-dress-name"
              name="name"
              required
              placeholder="Luna Off-Shoulder Satin"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-dress-slug">Slug (optional)</Label>
            <Input
              id="new-dress-slug"
              name="slug"
              placeholder="luna-off-shoulder-satin"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-dress-price">Price (VND)</Label>
            <Input
              id="new-dress-price"
              name="price"
              type="number"
              min="1"
              step="1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-dress-status">Status</Label>
            <Select
              id="new-dress-status"
              name="status"
              defaultValue={ProductStatus.DRAFT}
            >
              {productStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {formatEnumLabel(status)}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-dress-description">Description</Label>
            <Textarea
              id="new-dress-description"
              name="description"
              required
              className="min-h-32"
            />
          </div>

          <label
            className="flex items-center gap-2 text-sm text-muted-foreground"
            htmlFor="new-dress-featured"
          >
            <input
              id="new-dress-featured"
              name="isFeatured"
              type="checkbox"
              className="size-4 rounded border-border"
            />
            Featured product
          </label>

          <Button type="submit">Create dress</Button>
        </form>

        <div className="space-y-3">
          {dresses.length === 0 ? (
            <p className="rounded-xl border border-border/70 bg-background/70 p-5 text-sm text-muted-foreground">
              No dresses found.
            </p>
          ) : (
            dresses.map((dress) => (
              <form
                key={dress.id}
                action={updateDressAction}
                className="space-y-3 rounded-xl border border-border/70 bg-background/70 p-4"
              >
                <input type="hidden" name="productId" value={dress.id} />

                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{dress.name}</p>
                    <p className="text-xs text-muted-foreground">
                      /{dress.slug}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {formatEnumLabel(dress.status)}
                  </Badge>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-1">
                    <Label htmlFor={`price-${dress.id}`}>
                      Price ({dress.currency})
                    </Label>
                    <Input
                      id={`price-${dress.id}`}
                      name="price"
                      type="number"
                      min="1"
                      step={dress.currency === "VND" ? "1" : "0.01"}
                      defaultValue={toPriceInputValue(
                        dress.priceInCents,
                        dress.currency
                      )}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor={`status-${dress.id}`}>Status</Label>
                    <Select
                      id={`status-${dress.id}`}
                      name="status"
                      defaultValue={dress.status}
                    >
                      {productStatusOptions.map((status) => (
                        <option key={status} value={status}>
                          {formatEnumLabel(status)}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label>Signals</Label>
                    <p className="text-xs text-muted-foreground">
                      Bookings {dress._count.bookings} | Wishlist{" "}
                      {dress._count.wishlistItems}
                    </p>
                  </div>
                </div>

                <label
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                  htmlFor={`featured-${dress.id}`}
                >
                  <input
                    id={`featured-${dress.id}`}
                    name="isFeatured"
                    type="checkbox"
                    defaultChecked={dress.isFeatured}
                    className="size-4 rounded border-border"
                  />
                  Featured product
                </label>

                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground">
                    Updated {formatDateTime(dress.updatedAt)}
                  </p>
                  <Button type="submit" size="sm">
                    Save
                  </Button>
                </div>
              </form>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
