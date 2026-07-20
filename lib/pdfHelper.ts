import { ArabicShaper } from "arabic-persian-reshaper";

export function formatFaText(text: string): string {
  if (!text) return "";

  const shaped = ArabicShaper.reshapeHtml(text);
  return shaped.split("").reverse().join("");
}
