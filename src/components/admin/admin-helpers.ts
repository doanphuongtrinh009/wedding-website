import { BookingStatus, OrderStatus } from "@prisma/client";

export function toDollars(cents: number) {
  return (cents / 100).toFixed(2);
}

export function getCustomerName(customer: {
  firstName: string | null;
  lastName: string | null;
  email: string;
}) {
  const fullName = [customer.firstName, customer.lastName]
    .filter(Boolean)
    .join(" ");
  return fullName || customer.email;
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
