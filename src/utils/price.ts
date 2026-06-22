export const cleanNumberString = (str: string): string => {
  if (!str) return "";
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  let cleaned = str;
  for (let i = 0; i < 10; i++) {
    cleaned = cleaned.replace(new RegExp(persianDigits[i], "g"), i.toString());
    cleaned = cleaned.replace(new RegExp(arabicDigits[i], "g"), i.toString());
  }
  return cleaned.replace(/[^0-9]/g, "");
};

export const formatToPersianWithCommas = (value: string | number): string => {
  if (value === undefined || value === null || value === "") return "";
  const cleaned = cleanNumberString(value.toString());
  if (!cleaned) return "";
  return new Intl.NumberFormat("fa-IR").format(parseInt(cleaned, 10));
};

export const parsePersianPrice = (val: string): number => {
  if (!val) return 0;
  const cleaned = cleanNumberString(val);
  return cleaned ? parseInt(cleaned, 10) : 0;
};
