import {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Search,
  Activity,
  ShieldAlert,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { FoodsTableProps, FoodsTableRef, Food } from "@/types/nutrition";
import { showAlert, showConfirm } from "@/utils/alert";

export default forwardRef<FoodsTableRef, FoodsTableProps>(
  function FoodsTable(props, ref) {
    const [foods, setFoods] = useState<Food[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchFoods = useCallback(async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/food?all=true");
        if (response.ok) {
          const data = await response.json();
          setFoods(data || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        refresh() {
          fetchFoods();
        },
      }),
      [fetchFoods],
    );

    useEffect(() => {
      fetchFoods();
    }, [fetchFoods]);

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
      try {
        const response = await fetch(`/api/food/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive: !currentStatus }),
        });

        if (response.ok) {
          showAlert("موفقیت", "وضعیت غذا با موفقیت تغییر کرد.", "success");
          fetchFoods();
        } else {
          showAlert("خطا", "خطا در تغییر وضعیت غذا", "error");
        }
      } catch (error) {
        showAlert("خطا", "خطایی در برقراری ارتباط با سرور رخ داد.", "error");
      }
    };

    const handleDelete = async (id: string) => {
      const confirmed = await showConfirm(
        "آیا مطمئن هستید؟",
        "این غذا به طور کامل از سیستم حذف خواهد شد!",
        "بله، حذف شود",
      );
      if (confirmed) {
        try {
          const response = await fetch(`/api/food/${id}`, {
            method: "DELETE",
          });

          if (response.ok) {
            showAlert("موفقیت", "غذا با موفقیت حذف شد.", "success");
            fetchFoods();
          } else {
            showAlert("خطا", "خطا در حذف غذا", "error");
          }
        } catch (error) {
          showAlert("خطا", "خطایی در برقراری ارتباط با سرور رخ داد.", "error");
        }
      }
    };

    const filteredFoods = foods.filter((food) =>
      food.name.toLowerCase().includes(search.toLowerCase()),
    );

    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              لیست غذاهای موجود
            </h2>
            <p className="text-gray-400 text-xs mt-1">
              تعداد کل غذاها: {filteredFoods.length} مورد
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی نام غذا..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pr-10 pl-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all placeholder-gray-500"
            />
            <Search className="w-4 h-4 text-gray-500 absolute top-1/2 right-3.5 -translate-y-1/2" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            در حال بارگذاری اطلاعات...
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="text-center py-12 text-gray-500 border border-dashed border-white/10 rounded-xl">
            <ShieldAlert className="w-12 h-12 mx-auto mb-3 text-gray-600" />
            هیچ غذایی یافت نشد.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-xs md:text-sm">
                  <th className="pb-3 pr-2">نام غذا</th>
                  <th className="pb-3">واحد اندازه گیری</th>
                  <th className="pb-3 text-center">کالری (Kcal)</th>
                  <th className="pb-3 text-center">پروتئین</th>
                  <th className="pb-3 text-center">کربوهیدرات</th>
                  <th className="pb-3 text-center">چربی</th>
                  <th className="pb-3 text-center">وضعیت</th>
                  <th className="pb-3 pl-2 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs md:text-sm text-gray-200">
                {filteredFoods.map((food) => (
                  <tr
                    key={food._id}
                    className="hover:bg-white/2 ss02 transition-colors"
                  >
                    <td className="py-3.5 pr-2 font-semibold text-white">
                      {food.name}
                    </td>
                    <td className="py-3.5 text-gray-300">{food.unit}</td>
                    <td className="py-3.5 text-center font-bold text-white">
                      {food.calories}
                    </td>
                    <td className="py-3.5 text-center text-purple-400 font-semibold">
                      {food.protein}g
                    </td>
                    <td className="py-3.5 text-center text-orange-400 font-semibold">
                      {food.carbs}g
                    </td>
                    <td className="py-3.5 text-center text-yellow-400 font-semibold">
                      {food.fat}g
                    </td>
                    <td className="py-3.5 text-center">
                      {food.isActive ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          فعال
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                          غیرفعال
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 pl-2 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() =>
                            handleToggleActive(food._id, food.isActive)
                          }
                          className={`p-1.5 cursor-pointer rounded-lg border transition-all ${
                            food.isActive
                              ? "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20"
                              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                          }`}
                          title={food.isActive ? "غیرفعال کردن" : "فعال کردن"}
                        >
                          {food.isActive ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(food._id)}
                          className="p-1.5 cursor-pointer rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  },
);
