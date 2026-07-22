"use client";
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import useSWR from "swr";
import { Search, Plus, Loader2, Film, Play, Eye, Trash2 } from "lucide-react";
import type {
  VideoInfo,
  VideosManagementProps,
  VideosManagementRef,
} from "@/types/workout";
import { showAlert, showConfirm } from "@/utils/alert";
import Pagination from "@/components/AdminPagination";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default forwardRef<VideosManagementRef, VideosManagementProps>(
  function VideosManagement(
    { setShowUploadVideoModal, setWatchingVideo, onVideosUpdate },
    ref,
  ) {
    const [searchVideoTerm, setSearchVideoTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const { data, isLoading, mutate } = useSWR(
      `/api/admin/video?page=${currentPage}`,
      fetcher,
    );

    const videos: VideoInfo[] = data?.videos || [];
    const totalPages: number = data?.totalPages || 1;

    useEffect(() => {
      if (data?.videos) {
        onVideosUpdate?.(data.videos);
      }
    }, [data, onVideosUpdate]);

    useImperativeHandle(
      ref,
      () => ({
        fetchVideos: async () => {
          await mutate();
        },
      }),
      [mutate],
    );

    const formatNumber = (num: number) => {
      return new Intl.NumberFormat("fa-IR").format(num);
    };

    const formatDuration = (sec?: number) => {
      if (!sec) return "۰:۰۰";
      const min = Math.floor(sec / 60);
      const remainingSec = sec % 60;
      return `${min}:${remainingSec.toString().padStart(2, "0")}`;
    };

    const getVideoLevelBadge = (level?: string) => {
      if (!level) return null;
      const styles: Record<string, string> = {
        beginner: "bg-green-500/20 text-green-400 border-green-500/30",
        intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        advanced: "bg-red-500/20 text-red-400 border-red-500/30",
      };
      const labels: Record<string, string> = {
        beginner: "مبتدی",
        intermediate: "متوسط",
        advanced: "حرفه‌ای",
      };
      return (
        <span
          className={`px-2 py-0.5 rounded border text-[10px] ${styles[level] || styles.beginner}`}
        >
          {labels[level]}
        </span>
      );
    };

    const handleDeleteVideo = async (id: string) => {
      if (
        !(await showConfirm("حذف ویدیو", "آیا از حذف این ویدیو اطمینان دارید؟"))
      )
        return;
      try {
        const res = await fetch(`/api/admin/video?id=${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          showAlert("موفقیت", "ویدیو با موفقیت حذف شد", "success");
          mutate();
        } else {
          const err = await res.json();
          showAlert("خطا", `خطا: ${err.message}`, "error");
        }
      } catch (e) {
        console.error(e);
      }
    };

    const filteredVideos = videos.filter(
      (vid) =>
        vid.title.toLowerCase().includes(searchVideoTerm.toLowerCase()) ||
        vid.description?.toLowerCase().includes(searchVideoTerm.toLowerCase()),
    );

    return (
      <div className="space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="جستجو در فیلم‌های آموزشی..."
              value={searchVideoTerm}
              onChange={(e) => setSearchVideoTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pr-10 pl-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 text-xs transition-colors"
            />
          </div>
          <button
            onClick={() => setShowUploadVideoModal(true)}
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            آپلود ویدیوی ورزشی جدید
          </button>
        </div>

        {isLoading ? (
          <div className="p-16 text-center text-white/60 flex items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
            <span>در حال بارگذاری بانک ویدیوها...</span>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-white/10 rounded-2xl text-white/40 flex flex-col items-center justify-center">
            <Film className="w-12 h-12 text-white/10 mb-3" />
            <p className="text-sm">
              هیچ ویدیوی تمرینی ثبت نشده است. همین حالا اولین ویدیو را آپلود
              کنید!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredVideos.map((vid) => (
                <div
                  key={vid._id}
                  className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col group hover:border-white/20 transition-all"
                >
                  <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                    {vid.thumbnailUrl ? (
                      <img
                        src={vid.thumbnailUrl}
                        alt={vid.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <Film className="w-8 h-8 text-white/20" />
                    )}

                    <button
                      onClick={() => setWatchingVideo(vid)}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity animate-none"
                    >
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </button>

                    <span className="absolute bottom-2 left-2 bg-black/75 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                      {formatDuration(vid.durationSec)}
                    </span>

                    <span className="absolute top-2 right-2">
                      {getVideoLevelBadge(vid.level)}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4
                        className="text-white font-bold text-sm line-clamp-1 mb-1"
                        title={vid.title}
                      >
                        {vid.title}
                      </h4>
                      <p className="text-white/50 text-xs line-clamp-2 leading-relaxed mb-4 min-h-[32px]">
                        {vid.description || "بدون توضیحات"}
                      </p>
                    </div>

                    <div className="flex gap-2 justify-between border-t border-white/5 pt-3">
                      <button
                        onClick={() => setWatchingVideo(vid)}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors border border-white/10 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        پخش فیلم
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(vid._id)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 p-2 rounded-lg transition-colors cursor-pointer"
                        title="حذف ویدیو"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="p-4 border-t border-white/10 bg-white/5 flex items-center justify-between rounded-xl">
                <span className="text-white/60 text-xs">
                  نمایش صفحه {formatNumber(currentPage)} از{" "}
                  {formatNumber(totalPages)}
                </span>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    );
  },
);
