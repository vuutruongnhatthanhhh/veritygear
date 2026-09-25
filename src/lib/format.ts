export function formatVnd(value: number): string {
  return value.toLocaleString("vi-VN") + "₫";
}

export function formatArticleDate(date: string, locale: string): string {
  return new Date(date).toLocaleDateString(locale === "en" ? "en-US" : "vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
