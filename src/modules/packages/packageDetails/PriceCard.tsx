import type { PriceCardProps } from "@/types/components";

export default function PriceCard({ price, originalPrice }: PriceCardProps) {
  const billingCycle = "monthly";

  const getPriceForCycle = (cycle: typeof billingCycle) => {
    return price[cycle];
  };

  const getOriginalPriceForCycle = (cycle: typeof billingCycle) => {
    return originalPrice[cycle];
  };

  const calculateDiscount = () => {
    const original = getOriginalPriceForCycle(billingCycle);
    const current = getPriceForCycle(billingCycle);
    return Math.round(((original - current) / original) * 100);
  };

  const currentPrice = getPriceForCycle(billingCycle);
  const oldPrice = getOriginalPriceForCycle(billingCycle);
  const discountPercent = calculateDiscount();

  return (
    <div className="relative z-10 bg-white/5 border border-white/5 rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-white/50 text-sm font-medium">
          مبلغ قابل پرداخت:
        </span>
        <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
          <span>{discountPercent.toLocaleString("fa-IR")}٪</span>
          <span>تخفیف</span>
        </div>
      </div>
      <div className="flex items-baseline gap-1 justify-between pt-1">
        <div className="text-4xl font-extrabold text-white font-morabbaReg leading-none">
          {currentPrice.toLocaleString("fa-IR")}
          <span className="text-sm font-normal text-white/50 mr-1.5">
            تومان
          </span>
        </div>
        <div className="text-sm text-white/30 line-through">
          {oldPrice.toLocaleString("fa-IR")}
        </div>
      </div>
    </div>
  );
}
