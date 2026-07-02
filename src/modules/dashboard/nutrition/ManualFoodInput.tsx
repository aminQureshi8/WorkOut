import React from "react";
import { useFormContext } from "react-hook-form";

const ManualFoodInput: React.FC = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-white/80 mb-2 text-xs">
          نام غذا / مکمل:
        </label>
        <input
          type="text"
          {...register("manualName", { required: true })}
          placeholder="مثال: فیله بوقلمون"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-white/80 mb-2 text-xs">
            کالری (هر واحد):
          </label>
          <input
            type="number"
            {...register("manualCalories", { required: true })}
            placeholder="مثال: ۱۵۰"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 text-sm"
          />
        </div>
        <div>
          <label className="block text-white/80 mb-2 text-xs">
            تعداد / مقدار:
          </label>
          <input
            type="number"
            {...register("foodQuantity", { required: true })}
            placeholder="مثال: ۱"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 text-sm"
          />
        </div>
      </div>

      <div className="border-t border-white/5 pt-4">
        <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-3">
          درشت‌مغذی‌ها به ازای هر واحد (اختیاری):
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-purple-300 mb-1 text-[10px]">
              پروتئین (g):
            </label>
            <input
              type="number"
              {...register("manualProtein")}
              placeholder="0"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 text-xs"
            />
          </div>
          <div>
            <label className="block text-orange-300 mb-1 text-[10px]">
              کربوهیدرات (g):
            </label>
            <input
              type="number"
              {...register("manualCarbs")}
              placeholder="0"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/50 text-xs"
            />
          </div>
          <div>
            <label className="block text-yellow-300 mb-1 text-[10px]">
              چربی (g):
            </label>
            <input
              type="number"
              {...register("manualFat")}
              placeholder="0"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-white/20 focus:outline-none focus:border-yellow-500/50 text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ManualFoodInput);
