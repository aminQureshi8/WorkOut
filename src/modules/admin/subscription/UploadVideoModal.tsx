"use client";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { showAlert } from "@/utils/alert";

interface UploadVideoModalProps {
  onClose: () => void;
  onUploadSuccess: () => void;
}

export default function UploadVideoModal({
  onClose,
  onUploadSuccess,
}: UploadVideoModalProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoDesc, setNewVideoDesc] = useState("");
  const [newVideoLevel, setNewVideoLevel] = useState("beginner");
  const [newVideoDuration, setNewVideoDuration] = useState("");
  const [newVideoTags, setNewVideoTags] = useState("");
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const handleUploadVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile || !thumbnailFile || !newVideoTitle) {
      showAlert(
        "هشدار",
        "لطفا فایل ویدیو، کاور و عنوان را انتخاب کنید",
        "warning",
      );
      return;
    }
    setUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append("videoFile", videoFile);
      formData.append("thumbnailFile", thumbnailFile);
      formData.append("title", newVideoTitle);
      formData.append("description", newVideoDesc);
      formData.append("level", newVideoLevel);
      formData.append("durationSec", newVideoDuration || "60");

      const tagsArray = newVideoTags
        ? newVideoTags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];
      formData.append("tags", JSON.stringify(tagsArray));

      const res = await fetch("/api/admin/video", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        showAlert("موفقیت", "ویدیو با موفقیت آپلود شد", "success");
        onUploadSuccess();
        onClose();
      } else {
        const err = await res.json();
        showAlert("خطا", `خطا در آپلود: ${err.message}`, "error");
      }
    } catch (e) {
      console.error(e);
      showAlert("خطا", "خطا در آپلود ویدیو", "error");
    } finally {
      setUploadingVideo(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-gray-900/80 backdrop-blur-lg">
          <h2
            className="text-xl text-white font-bold"
            style={{ fontFamily: "Marbeh, sans-serif" }}
          >
            آپلود ویدیوی ورزشی جدید به آروان
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white/60 hover:text-white"
            disabled={uploadingVideo}
          >
            ✕
          </button>
        </div>

        {uploadingVideo ? (
          <div className="p-12 text-center text-white space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto" />
            <div className="font-bold text-sm">
              در حال آپلود ویدیو به سرورهای ابری آروان...
            </div>
            <p className="text-white/50 text-xs">
              لطفاً پنجره را نبندید. آپلود فایل‌های حجیم ممکن است چند
              دقیقه طول بکشد.
            </p>
          </div>
        ) : (
          <form onSubmit={handleUploadVideo} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-xs mb-2 font-medium">
                  فایل ویدیو (MP4)*
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    setVideoFile(e.target.files?.[0] || null)
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-white/80 text-xs mb-2 font-medium">
                  فایل کاور (Thumbnail JPG/PNG)*
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setThumbnailFile(e.target.files?.[0] || null)
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-xs mb-2 font-medium">
                عنوان ویدیو*
              </label>
              <input
                type="text"
                placeholder="مثال: جلو بازو دمبل تناوبی تمرکزی"
                value={newVideoTitle}
                onChange={(e) => setNewVideoTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-xs focus:outline-none focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-white/80 text-xs mb-2 font-medium">
                توضیحات حرکت
              </label>
              <textarea
                placeholder="توضیح دهید حرکت چگونه انجام می‌شود..."
                value={newVideoDesc}
                onChange={(e) => setNewVideoDesc(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-xs focus:outline-none focus:border-orange-500 resize-none h-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-xs mb-2 font-medium">
                  سطح سختی*
                </label>
                <select
                  value={newVideoLevel}
                  onChange={(e) => setNewVideoLevel(e.target.value)}
                  className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2.5 text-white text-xs focus:outline-none focus:border-orange-500"
                >
                  <option value="beginner">مبتدی (Beginner)</option>
                  <option value="intermediate">
                    متوسط (Intermediate)
                  </option>
                  <option value="advanced">حرفه‌ای (Advanced)</option>
                </select>
              </div>
              <div>
                <label className="block text-white/80 text-xs mb-2 font-medium">
                  مدت زمان (ثانیه)
                </label>
                <input
                  type="number"
                  placeholder="۶۰"
                  value={newVideoDuration}
                  onChange={(e) => setNewVideoDuration(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-xs mb-2 font-medium">
                تگ‌ها (با ویرگول انگلیسی جدا کنید)
              </label>
              <input
                type="text"
                placeholder="مثال: بازو, دمبل, سینه, سرشانه"
                value={newVideoTags}
                onChange={(e) => setNewVideoTags(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-xs focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2.5 rounded-lg hover:opacity-90 font-medium text-sm cursor-pointer"
              >
                شروع فرآیند آپلود
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-lg border border-white/10 text-sm cursor-pointer"
              >
                انصراف
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
