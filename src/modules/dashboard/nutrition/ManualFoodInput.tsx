import React from "react";

interface ManualFoodInputProps {
  manualName: string;
  manualCalories: string;
  foodQuantity: string;
  manualProtein: string;
  manualCarbs: string;
  manualFat: string;
  onChangeName: (val: string) => void;
  onChangeCalories: (val: string) => void;
  onChangeQuantity: (val: string) => void;
  onChangeProtein: (val: string) => void;
  onChangeCarbs: (val: string) => void;
  onChangeFat: (val: string) => void;
}

const ManualFoodInput: React.FC<ManualFoodInputProps> = ({
  manualName,
  manualCalories,
  foodQuantity,
  manualProtein,
  manualCarbs,
  manualFat,
  onChangeName,
  onChangeCalories,
  onChangeQuantity,
  onChangeProtein,
  onChangeCarbs,
  onChangeFat,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-white/80 mb-2 text-xs">
          نام غذا / مکمل:
        </label>
        <input
          type="text"
          value={manualName}
          onChange={(e) => onChangeName(e.target.value)}
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
            value={manualCalories}
            onChange={(e) => onChangeCalories(e.target.value)}
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
            value={foodQuantity}
            onChange={(e) => onChangeQuantity(e.target.value)}
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
              value={manualProtein}
              onChange={(e) => onChangeProtein(e.target.value)}
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
              value={manualCarbs}
              onChange={(e) => onChangeCarbs(e.target.value)}
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
              value={manualFat}
              onChange={(e) => onChangeFat(e.target.value)}
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
