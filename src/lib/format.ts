export function formatVnd(value: number): string {
  return value.toLocaleString("vi-VN") + "₫";
}

// Locale-aware price display: VND amounts render as USD on the English
// locale (converted via the admin-configured rate), VND everywhere else.
// Actual payment always settles in VND regardless of display locale.
export function formatPrice(amountVnd: number, locale: string, rate: number): string {
  if (locale === "en") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amountVnd / rate);
  }
  return formatVnd(amountVnd);
}

export function formatArticleDate(date: string, locale: string): string {
  return new Date(date).toLocaleDateString(locale === "en" ? "en-US" : "vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
