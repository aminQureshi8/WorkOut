export function toEnglishDigits(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString())
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString())
    .trim();
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("fa-IR").format(num);
}
