"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Users, Check, X, Clock, Film } from "lucide-react";

import { PackageInfo, SubscriptionItem, VideoInfo, SubscriptionsTableRef, VideosManagementRef } from "@/types/workout";

import UploadVideoModal from "./UploadVideoModal";
import VideosManagement from "./VideosManagement";
import CreateSubscriptionModal from "./CreateSubscriptionModal";
import SubscriptionsTable from "./SubscriptionsTable";
import WorkoutPlanModal from "./WorkoutPlanModal";
import EditSubscriptionModal from "./EditSubscriptionModal";
import VideoPlayerModal from "@/components/VideoPlayerModal";

export default function SubscriptionsManagement() {
  const tableRef = useRef<SubscriptionsTableRef>(null);
  const videosRef = useRef<VideosManagementRef>(null);

  const [activeTab, setActiveTab] = useState<"subscriptions" | "videos">(
    "subscriptions",
  );

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    trial: 0,
    expired: 0,
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);

  const [selectedSubscription, setSelectedSubscription] =
    useState<SubscriptionItem | null>(null);
  const [selectedPackageForPlan, setSelectedPackageForPlan] =
    useState<PackageInfo | null>(null);

  const [packages, setPackages] = useState<PackageInfo[]>([]);
  const [videos, setVideos] = useState<VideoInfo[]>([]);

  const [showUploadVideoModal, setShowUploadVideoModal] = useState(false);
  const [watchingVideo, setWatchingVideo] = useState<VideoInfo | null>(null);

  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/admin/package");
      if (res.ok) {
        const data = await res.json();
        setPackages(data.packages || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleOpenPlanModal = (pkg: PackageInfo) => {
    setSelectedPackageForPlan(pkg);
    setShowPlanModal(true);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fa-IR").format(num);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br bg-black/30 p-4 md:p-8"
      dir="rtl"
    >
      <div className="container mx-auto pt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl text-white mb-2 font-morabeReg">
              مدیریت اشتراک و ویدیوها
            </h1>
            <p className="text-white/60 text-xs sm:text-sm md:text-base">
              تخصیص برنامه‌های ورزشی به کاربران و مدیریت بانک فیلم‌های آموزشی
              بدنسازی
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-5 py-3 rounded-lg flex items-center gap-2 hover:shadow-lg hover:shadow-orange-500/30 transition-all font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              ثبت اشتراک دستی
            </button>
            <button
              onClick={() => {
                setActiveTab("videos");
                setShowUploadVideoModal(true);
              }}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-3 rounded-lg flex items-center gap-2 transition-all font-medium text-sm"
            >
              <Film className="w-4 h-4 text-orange-400" />
              آپلود ویدیوی جدید
            </button>
          </div>
        </div>

        <div className="border-b border-white/10 mb-6 flex gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab("subscriptions")}
            className={`pb-3 font-semibold text-sm transition-all border-b-2 px-2 flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === "subscriptions"
                ? "border-orange-500 text-white"
                : "border-transparent text-white/55 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            اشتراک‌ها و برنامه‌های تمرینی
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`pb-3 font-semibold text-sm transition-all border-b-2 px-2 flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === "videos"
                ? "border-orange-500 text-white"
                : "border-transparent text-white/55 hover:text-white"
            }`}
          >
            <Film className="w-4 h-4" />
            بانک ویدیوهای آموزشی ({videos.length})
          </button>
        </div>

        {activeTab === "subscriptions" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60 text-sm">کل اشتراک‌ها</span>
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-3xl text-white font-bold font-morabeReg">
                  {formatNumber(stats.total)}
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60 text-sm">فعال</span>
                  <Check className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-3xl text-white font-bold font-morabeReg">
                  {formatNumber(stats.active)}
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60 text-sm">آزمایشی (Trial)</span>
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-3xl text-white font-bold font-morabeReg">
                  {formatNumber(stats.trial)}
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60 text-sm">منقضی شده</span>
                  <X className="w-5 h-5 text-red-400" />
                </div>
                <div className="text-3xl text-white font-bold font-morabeReg">
                  {formatNumber(stats.expired)}
                </div>
              </div>
            </div>

            <SubscriptionsTable
              ref={tableRef}
              onOpenPlanModal={handleOpenPlanModal}
              onEdit={(sub) => {
                setSelectedSubscription(sub);
                setShowEditModal(true);
              }}
              onStatsUpdate={setStats}
            />
          </>
        )}

        {activeTab === "videos" && (
          <VideosManagement
            ref={videosRef}
            onVideosUpdate={setVideos}
            setShowUploadVideoModal={setShowUploadVideoModal}
            setWatchingVideo={setWatchingVideo}
          />
        )}

        {showUploadVideoModal && (
          <UploadVideoModal
            onClose={() => setShowUploadVideoModal(false)}
            onUploadSuccess={() => videosRef.current?.fetchVideos()}
          />
        )}

        {showCreateModal && (
          <CreateSubscriptionModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => tableRef.current?.refresh()}
            packages={packages}
          />
        )}

        {showEditModal && selectedSubscription && (
          <EditSubscriptionModal
            selectedSubscription={selectedSubscription}
            onClose={() => setShowEditModal(false)}
            onSuccess={() => tableRef.current?.refresh()}
          />
        )}

        {showPlanModal && selectedPackageForPlan && (
          <WorkoutPlanModal
            selectedPackageForPlan={selectedPackageForPlan}
            onClose={() => setShowPlanModal(false)}
            videos={videos}
            setWatchingVideo={setWatchingVideo}
          />
        )}

        {watchingVideo && (
          <VideoPlayerModal
            video={watchingVideo}
            onClose={() => setWatchingVideo(null)}
          />
        )}
      </div>
    </div>
  );
}
