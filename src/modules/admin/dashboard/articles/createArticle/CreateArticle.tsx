"use client";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Link from "next/link";
import { ArrowRight, Save, Eye, X, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { showAlert } from "@/utils/alert";
import { useRouter } from "next/navigation";

const CKEditorWrapper = dynamic(() => import("./CKEditorWrapper"), {
  ssr: false,
});

type FormValues = {
  title: string;
  category: string;
  content: string;
  excerpt: string;
  status: "draft" | "published" | "scheduled";
  publishDate: string;
  seoTitle: string;
  seoDescription: string;
};

export default function CreateArticle() {
  const router = useRouter();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [author, setAuthor] = useState<{ fullName?: string; username?: string; role?: string } | null>(null);

  useEffect(() => {
    async function loadAuthor() {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setAuthor(data.user);
          }
        }
      } catch (err) {
        console.error("Failed to load author details:", err);
      }
    }
    loadAuthor();
  }, []);

  const categories = ["بدنسازی", "تغذیه", "کاهش وزن", "سلامت", "مکمل", "تکنیک"];

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      category: "بدنسازی",
      content: "",
      excerpt: "",
      status: "draft",
      publishDate: "",
      seoTitle: "",
      seoDescription: "",
    },
  });

  const watchedStatus = watch("status");
  const watchedExcerpt = watch("excerpt");
  const watchedContent = watch("content");
  const watchedSeoTitle = watch("seoTitle");
  const watchedSeoDescription = watch("seoDescription");

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFeaturedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormValues, submitStatus: "draft" | "published") => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("category", data.category);
      formData.append("content", data.content);
      formData.append("excerpt", data.excerpt || "");
      formData.append("status", submitStatus);
      if (data.publishDate) {
        formData.append("publishDate", data.publishDate);
      }
      formData.append("seoTitle", data.seoTitle || "");
      formData.append("seoDescription", data.seoDescription || "");
      formData.append("tags", JSON.stringify(tags));
      if (featuredImageFile) {
        formData.append("image", featuredImageFile);
      }

      const res = await fetch("/api/admin/blog", {
        method: "POST",
        body: formData,
      });

      const resData = await res.json();

      if (res.ok) {
        showAlert({
          title: "موفقیت‌آمیز",
          text: `مقاله با موفقیت ${submitStatus === "draft" ? "به عنوان پیش‌نویس ذخیره" : "منتشر"} شد!`,
          icon: "success",
        }).then(() => {
          router.push("/admin/articles");
          router.refresh();
        });
      } else {
        showAlert({
          title: "خطا",
          text: resData.message || "خطا در ثبت مقاله رخ داده است.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error(error);
      showAlert({
        title: "خطا",
        text: "خطا در ارتباط با سرور رخ داده است.",
        icon: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/articles"
              className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <ArrowRight className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl text-white mb-1 font-morabbaReg">ایجاد مقاله جدید</h1>
              <p className="text-white/60">مقاله خود را بنویسید و منتشر کنید</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSubmit((data) => onSubmit(data, "draft"))}
              disabled={saving}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              ذخیره پیش‌نویس
            </button>
            <button
              onClick={handleSubmit((data) => onSubmit(data, "published"))}
              disabled={saving}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
              انتشار مقاله
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <label className="block text-white mb-3">عنوان مقاله</label>
              <input
                {...register("title", { required: "عنوان مقاله الزامی است" })}
                placeholder="عنوان جذاب مقاله خود را وارد کنید..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-xl placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 font-morabbaReg"
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-2">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <label className="block text-white mb-3">تصویر شاخص</label>
              {featuredImage ? (
                <div className="relative">
                  <Image
                    src={featuredImage}
                    alt="Featured"
                    width={800}
                    height={256}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setFeaturedImage("");
                      setFeaturedImageFile(null);
                    }}
                    className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-white/20 rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500/50 transition-colors">
                  <ImageIcon className="w-12 h-12 text-white/40 mb-3" />
                  <p className="text-white/60 mb-2">
                    کلیک کنید یا تصویر را بکشید
                  </p>
                  <p className="text-white/40 text-sm">
                    JPG, PNG یا WEBP (حداکثر ۲MB)
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <label className="block text-white mb-3">خلاصه مقاله</label>
              <textarea
                {...register("excerpt")}
                placeholder="خلاصه‌ای کوتاه از محتوای مقاله..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 resize-none"
              />
              <div className="text-white/40 text-sm mt-2">
                {watchedExcerpt.length} / ۲۵۰ کاراکتر
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <label className="block text-white mb-3">محتوای مقاله</label>
              <div className="ckeditor-wrapper">
                <Controller
                  name="content"
                  control={control}
                  rules={{ required: "محتوای مقاله الزامی است" }}
                  render={({ field }) => (
                    <CKEditorWrapper
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              {errors.content && (
                <p className="text-red-400 text-sm mt-2">
                  {errors.content.message}
                </p>
              )}
              <div className="text-white/40 text-sm mt-2">
                {
                  watchedContent
                    .replace(/<[^>]+>/g, "")
                    .split(/\s+/)
                    .filter((w) => w.length > 0).length
                }{" "}
                کلمه
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <h3 className="text-white text-lg mb-4 font-morabbaReg">
                تنظیمات سئو
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 mb-2">عنوان سئو</label>
                  <input
                    {...register("seoTitle")}
                    placeholder="عنوان برای موتورهای جستجو..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
                  />
                  <div className="text-white/40 text-sm mt-1">
                    {watchedSeoTitle.length} / ۶۰ کاراکتر
                  </div>
                </div>
                <div>
                  <label className="block text-white/80 mb-2">
                    توضیحات سئو
                  </label>
                  <textarea
                    {...register("seoDescription")}
                    placeholder="توضیحات برای موتورهای جستجو..."
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 resize-none"
                  />
                  <div className="text-white/40 text-sm mt-1">
                    {watchedSeoDescription.length} / ۱۶۰ کاراکتر
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4 font-morabbaReg">
                تنظیمات انتشار
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 mb-2">وضعیت</label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 appearance-none cursor-pointer"
                      >
                        <option value="draft" className="bg-gray-800">
                          پیش‌نویس
                        </option>
                        <option value="published" className="bg-gray-800">
                          منتشر شده
                        </option>
                        <option value="scheduled" className="bg-gray-800">
                          زمان‌بندی شده
                        </option>
                      </select>
                    )}
                  />
                </div>

                {watchedStatus === "scheduled" && (
                  <div>
                    <label className="block text-white/80 mb-2">
                      تاریخ انتشار
                    </label>
                    <input
                      {...register("publishDate")}
                      type="datetime-local"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4 font-morabbaReg">
                دسته‌بندی
              </h3>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 appearance-none cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-gray-800">
                        {cat}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4 font-morabbaReg">
                برچسب‌ها
              </h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  placeholder="برچسب جدید..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  افزودن
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-500/20 border border-blue-500/30 text-blue-400 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-blue-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
              {tags.length === 0 && (
                <p className="text-white/40 text-sm">برچسبی اضافه نشده است</p>
              )}
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <h3 className="text-white mb-4 font-morabbaReg">
                اطلاعات نویسنده
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
                  {author ? (author.fullName ? author.fullName.charAt(0) : author.username?.charAt(0) || "U") : "..."}
                </div>
                <div>
                  <div className="text-white">
                    {author ? author.fullName || author.username : "در حال بارگذاری..."}
                  </div>
                  <div className="text-white/60 text-sm">
                    {author ? (author.role === "admin" ? "مدیر سایت" : author.role === "coach" ? "مربی مجرب" : "کاربر") : "..."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
