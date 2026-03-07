import { BookingStatus, OrderStatus } from "@/generated/prisma/browser";

export function toPriceInputValue(valueInMinorUnits: number, currency: string) {
  if (currency === "VND") {
    return String(Math.round(valueInMinorUnits));
  }

  return (valueInMinorUnits / 100).toFixed(2);
}

export function getCustomerName(customer: {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}) {
  const fullName = [customer.firstName, customer.lastName]
    .filter(Boolean)
    .join(" ");
  return fullName || customer.email || "Unknown customer";
}

export function getBookingVariant(
  status: BookingStatus
): "default" | "secondary" | "outline" {
  if (status === BookingStatus.CONFIRMED) {
    return "default";
  }

  if (status === BookingStatus.PENDING) {
    return "secondary";
  }

  return "outline";
}

export function getOrderVariant(
  status: OrderStatus
): "default" | "secondary" | "outline" {
  if (status === OrderStatus.PAID || status === OrderStatus.FULFILLED) {
    return "default";
  }

  if (status === OrderStatus.CONFIRMED || status === OrderStatus.PENDING) {
    return "secondary";
  }

  return "outline";
}
