const currencyFormatterCache = new Map<string, Intl.NumberFormat>();
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric"
});
const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit"
});

function getCurrencyFormatter(currency: string) {
  const existingFormatter = currencyFormatterCache.get(currency);

  if (existingFormatter) {
    return existingFormatter;
  }

  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  });
  currencyFormatterCache.set(currency, formatter);

  return formatter;
}

export function formatCurrency(valueInCents: number, currency: string) {
  const isVND = currency === "VND";
  const value = isVND ? valueInCents : valueInCents / 100;

  return getCurrencyFormatter(currency).format(value);
}

export function formatDate(dateValue: Date | string) {
  return dateFormatter.format(new Date(dateValue));
}

export function formatDateTime(dateValue: Date | string) {
  return dateTimeFormatter.format(new Date(dateValue));
}

export function formatEnumLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}
