const currencyFormatterCache = new Map<string, Intl.NumberFormat>();
const zeroDecimalCurrencies = new Set([
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "JPY",
  "KMF",
  "KRW",
  "MGA",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF"
]);
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

export function isZeroDecimalCurrency(currency: string) {
  return zeroDecimalCurrencies.has(currency.toUpperCase());
}

export function toCurrencyMajorUnit(
  valueInMinorUnits: number,
  currency: string
) {
  if (isZeroDecimalCurrency(currency)) {
    return valueInMinorUnits;
  }

  return valueInMinorUnits / 100;
}

export function formatCurrency(valueInCents: number, currency: string) {
  return getCurrencyFormatter(currency).format(
    toCurrencyMajorUnit(valueInCents, currency)
  );
}

export function formatCurrencyForStructuredData(
  valueInMinorUnits: number,
  currency: string
) {
  const value = toCurrencyMajorUnit(valueInMinorUnits, currency);

  if (isZeroDecimalCurrency(currency)) {
    return String(Math.round(value));
  }

  return value.toFixed(2);
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
