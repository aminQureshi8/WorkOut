"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Dumbbell,
  Users,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Clock,
  ExternalLink,
  ChevronDown,
  Eye,
  AlertCircle,
  Video,
  Play,
  Film
} from "lucide-react";

import {
  UserInfo,
  PackageInfo,
  SubscriptionItem,
  WorkoutPlan,
  WorkoutDay,
  VideoInfo,
  WorkoutExercise,
} from "@/types/workout";

import { showAlert, showConfirm } from "@/utils/alert";

export default function SubscriptionsManagement() {

  
  const [activeTab, setActiveTab] = useState<"subscriptions" | "videos">("subscriptions");

  
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    trial: 0,
    expired: 0
  });

  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  
  
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionItem | null>(null);
  const [selectedPackageForPlan, setSelectedPackageForPlan] = useState<PackageInfo | null>(null);

  
  
  const [editStatus, setEditStatus] = useState<SubscriptionItem["status"]>("active");
  const [editEndsAt, setEditEndsAt] = useState("");

  
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [searchedUsers, setSearchedUsers] = useState<UserInfo[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [packages, setPackages] = useState<PackageInfo[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [createStatus, setCreateStatus] = useState<SubscriptionItem["status"]>("active");
  const [createEndsAt, setCreateEndsAt] = useState("");

  
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null);
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [videos, setVideos] = useState<VideoInfo[]>([]);

  
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [searchVideoTerm, setSearchVideoTerm] = useState("");
  const [showUploadVideoModal, setShowUploadVideoModal] = useState(false);
  
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoDesc, setNewVideoDesc] = useState("");
  const [newVideoLevel, setNewVideoLevel] = useState("beginner");
  const [newVideoDuration, setNewVideoDuration] = useState("");
  const [newVideoTags, setNewVideoTags] = useState("");
  const [uploadingVideo, setUploadingVideo] = useState(false);

  
  const [watchingVideo, setWatchingVideo] = useState<VideoInfo | null>(null);

  
  const [planForm, setPlanForm] = useState({ title: "", description: "" });
  const [isEditingPlanInfo, setIsEditingPlanInfo] = useState(false);

  const [showDayForm, setShowDayForm] = useState(false);
  const [editingDay, setEditingDay] = useState<WorkoutDay | null>(null);
  const [dayForm, setDayForm] = useState({ dayName: "", muscleGroup: "", sortOrder: 0 });

  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState<WorkoutExercise | null>(null);
  const [exerciseForm, setExerciseForm] = useState({
    name: "",
    sets: 3,
    reps: "12-10-8",
    restSec: 60,
    videoId: "",
    videoId2: "",
    sortOrder: 0
  });

  
  useEffect(() => {
    fetchSubscriptions();
  }, [currentPage, debouncedSearch, statusFilter]);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  
  useEffect(() => {
    fetchPackages();
    fetchVideos();
  }, []);

  
  useEffect(() => {
    if (userSearchTerm.length > 1) {
      const fetchSearchUsers = async () => {
        try {
          const res = await fetch(`/api/admin/search?query=${encodeURIComponent(userSearchTerm)}`);
          if (res.ok) {
            const data = await res.json();
            setSearchedUsers(data.userFind || []);
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchSearchUsers();
    } else {
      setSearchedUsers([]);
    }
  }, [userSearchTerm]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const url = `/api/admin/subscription?page=${currentPage}&limit=8&status=${statusFilter}&search=${encodeURIComponent(debouncedSearch)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch subscriptions");
      const data = await res.json();
      setSubscriptions(data.subscriptions || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);

      
      const statsRes = await fetch("/api/admin/subscription?limit=10000");
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        const allSubs: SubscriptionItem[] = statsData.subscriptions || [];
        setStats({
          total: allSubs.length,
          active: allSubs.filter(s => s.status === "active").length,
          trial: allSubs.filter(s => s.status === "trial").length,
          expired: allSubs.filter(s => s.status === "expired").length
        });
      }
    } catch (e) {
      console.error(e);
      showAlert("خطا", "خطا در بارگذاری اشتراک‌ها", "error");
    } finally {
      setLoading(false);
    }
  };

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

  const fetchVideos = async () => {
    setLoadingVideos(true);
    try {
      const res = await fetch("/api/admin/video");
      if (res.ok) {
        const data = await res.json();
        setVideos(data.videos || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingVideos(false);
    }
  };

  
  const handleUploadVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile || !thumbnailFile || !newVideoTitle) {
      showAlert("هشدار", "لطفا فایل ویدیو، کاور و عنوان را انتخاب کنید", "warning");
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
        ? newVideoTags.split(",").map(t => t.trim()).filter(Boolean)
        : [];
      formData.append("tags", JSON.stringify(tagsArray));

      const res = await fetch("/api/admin/video", {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        showAlert("موفقیت", "ویدیو با موفقیت آپلود شد", "success");
        setShowUploadVideoModal(false);
        
        setVideoFile(null);
        setThumbnailFile(null);
        setNewVideoTitle("");
        setNewVideoDesc("");
        setNewVideoLevel("beginner");
        setNewVideoDuration("");
        setNewVideoTags("");
        fetchVideos();
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

  const handleDeleteVideo = async (id: string) => {
    if (!(await showConfirm("حذف ویدیو", "آیا از حذف این ویدیو اطمینان دارید؟"))) return;
    try {
      const res = await fetch(`/api/admin/video?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        showAlert("موفقیت", "ویدیو با موفقیت حذف شد", "success");
        fetchVideos();
      } else {
        const err = await res.json();
        showAlert("خطا", `خطا: ${err.message}`, "error");
      }
    } catch (e) {
      console.error(e);
    }
  };

  
  const handleCreateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedPackageId) {
      showAlert("هشدار", "لطفا کاربر و پکیج را انتخاب کنید", "warning");
      return;
    }
    try {
      const res = await fetch("/api/admin/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser._id,
          packageId: selectedPackageId,
          status: createStatus,
          endsAt: createEndsAt ? new Date(createEndsAt).toISOString() : undefined
        })
      });
      if (res.ok) {
        showAlert("موفقیت", "اشتراک با موفقیت ثبت شد", "success");
        setShowCreateModal(false);
        setSelectedUser(null);
        setSelectedPackageId("");
        setCreateStatus("active");
        setCreateEndsAt("");
        setUserSearchTerm("");
        fetchSubscriptions();
      } else {
        const err = await res.json();
        showAlert("خطا", `خطا: ${err.message}`, "error");
      }
    } catch (e) {
      console.error(e);
      showAlert("خطا", "خطا در ایجاد اشتراک", "error");
    }
  };

  const handleEditSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubscription) return;
    try {
      const res = await fetch("/api/admin/subscription", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedSubscription._id,
          status: editStatus,
          endsAt: editEndsAt ? new Date(editEndsAt).toISOString() : undefined
        })
      });
      if (res.ok) {
        showAlert("موفقیت", "اشتراک با موفقیت بروزرسانی شد", "success");
        setShowEditModal(false);
        fetchSubscriptions();
      } else {
        const err = await res.json();
        showAlert("خطا", `خطا: ${err.message}`, "error");
      }
    } catch (e) {
      console.error(e);
      showAlert("خطا", "خطا در ویرایش اشتراک", "error");
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    if (!(await showConfirm("حذف اشتراک", "آیا از حذف این اشتراک اطمینان دارید؟"))) return;
    try {
      const res = await fetch(`/api/admin/subscription?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        showAlert("موفقیت", "اشتراک با موفقیت حذف شد", "success");
        fetchSubscriptions();
      } else {
        const err = await res.json();
        showAlert("خطا", `خطا: ${err.message}`, "error");
      }
    } catch (e) {
      console.error(e);
      showAlert("خطا", "خطا در حذف اشتراک", "error");
    }
  };

  
  const handleOpenPlanModal = async (pkg: PackageInfo) => {
    setSelectedPackageForPlan(pkg);
    setWorkoutPlan(null);
    setWorkoutDays([]);
    setSelectedDay(null);
    setExercises([]);
    setShowPlanModal(true);

    try {
      const res = await fetch(`/api/admin/subscription/workout-plans?packageId=${pkg._id}`);
      if (res.ok) {
        const data = await res.json();
        const plan = data.plans && data.plans.length > 0 ? data.plans[0] : null;
        if (plan) {
          setWorkoutPlan(plan);
          setPlanForm({ title: plan.title, description: plan.description || "" });
          fetchDays(plan._id);
        } else {
          setPlanForm({ title: `برنامه تمرینی ${pkg.name}`, description: "" });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackageForPlan) return;
    try {
      const res = await fetch("/api/admin/subscription/workout-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: selectedPackageForPlan._id,
          title: planForm.title,
          description: planForm.description
        })
      });
      if (res.ok) {
        const data = await res.json();
        setWorkoutPlan(data.plan);
        showAlert("موفقیت", "برنامه تمرینی با موفقیت ایجاد شد", "success");
      }
    } catch (e) {
      console.error(e);
      showAlert("خطا", "خطا در ایجاد برنامه", "error");
    }
  };

  const handleUpdatePlan = async () => {
    if (!workoutPlan) return;
    try {
      const res = await fetch("/api/admin/subscription/workout-plans", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: workoutPlan._id,
          title: planForm.title,
          description: planForm.description
        })
      });
      if (res.ok) {
        const data = await res.json();
        setWorkoutPlan(data.plan);
        setIsEditingPlanInfo(false);
        showAlert("موفقیت", "برنامه تمرینی با موفقیت بروزرسانی شد", "success");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePlan = async () => {
    if (!workoutPlan) return;
    if (!(await showConfirm("حذف برنامه تمرینی", "آیا از حذف کامل این برنامه تمرینی به همراه تمام روزها و حرکات آن اطمینان دارید؟"))) return;
    try {
      const res = await fetch(`/api/admin/subscription/workout-plans?id=${workoutPlan._id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setWorkoutPlan(null);
        setWorkoutDays([]);
        setSelectedDay(null);
        setExercises([]);
        showAlert("موفقیت", "برنامه تمرینی با موفقیت حذف شد", "success");
      }
    } catch (e) {
      console.error(e);
    }
  };

  
  const fetchDays = async (planId: string) => {
    try {
      const res = await fetch(`/api/admin/subscription/workout-days?planId=${planId}`);
      if (res.ok) {
        const data = await res.json();
        setWorkoutDays(data.days || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workoutPlan) return;
    try {
      if (editingDay) {
        const res = await fetch("/api/admin/subscription/workout-days", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingDay._id,
            dayName: dayForm.dayName,
            muscleGroup: dayForm.muscleGroup,
            sortOrder: Number(dayForm.sortOrder)
          })
        });
        if (res.ok) {
          fetchDays(workoutPlan._id);
          setShowDayForm(false);
          setEditingDay(null);
          if (selectedDay?._id === editingDay._id) {
            setSelectedDay({ ...selectedDay, ...dayForm });
          }
        }
      } else {
        const res = await fetch("/api/admin/subscription/workout-days", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planId: workoutPlan._id,
            dayName: dayForm.dayName,
            muscleGroup: dayForm.muscleGroup,
            sortOrder: Number(dayForm.sortOrder)
          })
        });
        if (res.ok) {
          fetchDays(workoutPlan._id);
          setShowDayForm(false);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteDay = async (id: string) => {
    if (!(await showConfirm("حذف روز تمرینی", "آیا از حذف این روز و تمامی حرکات ورزشی آن اطمینان دارید؟"))) return;
    try {
      const res = await fetch(`/api/admin/subscription/workout-days?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        if (selectedDay?._id === id) {
          setSelectedDay(null);
          setExercises([]);
        }
        if (workoutPlan) fetchDays(workoutPlan._id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  
  const fetchExercises = async (dayId: string) => {
    try {
      const res = await fetch(`/api/admin/subscription/workout-exercises?dayId=${dayId}`);
      if (res.ok) {
        const data = await res.json();
        setExercises(data.exercises || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleExerciseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay) return;
    try {
      if (editingExercise) {
        const res = await fetch("/api/admin/subscription/workout-exercises", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingExercise._id,
            name: exerciseForm.name,
            sets: Number(exerciseForm.sets),
            reps: exerciseForm.reps,
            restSec: Number(exerciseForm.restSec),
            videoId: exerciseForm.videoId || null,
            videoId2: exerciseForm.videoId2 || null,
            sortOrder: Number(exerciseForm.sortOrder)
          })
        });
        if (res.ok) {
          fetchExercises(selectedDay._id);
          setShowExerciseForm(false);
          setEditingExercise(null);
        }
      } else {
        const res = await fetch("/api/admin/subscription/workout-exercises", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dayId: selectedDay._id,
            name: exerciseForm.name,
            sets: Number(exerciseForm.sets),
            reps: exerciseForm.reps,
            restSec: Number(exerciseForm.restSec),
            videoId: exerciseForm.videoId || undefined,
            videoId2: exerciseForm.videoId2 || undefined,
            sortOrder: Number(exerciseForm.sortOrder)
          })
        });
        if (res.ok) {
          fetchExercises(selectedDay._id);
          setShowExerciseForm(false);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteExercise = async (id: string) => {
    if (!(await showConfirm("حذف حرکت تمرینی", "آیا از حذف این حرکت تمرینی اطمینان دارید؟"))) return;
    try {
      const res = await fetch(`/api/admin/subscription/workout-exercises?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        if (selectedDay) fetchExercises(selectedDay._id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fa-IR").format(num);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fa-IR");
    } catch (e) {
      return dateString;
    }
  };

  const formatDuration = (sec?: number) => {
    if (!sec) return "۰:۰۰";
    const min = Math.floor(sec / 60);
    const remainingSec = sec % 60;
    return `${min}:${remainingSec.toString().padStart(2, "0")}`;
  };

  const getStatusBadge = (status: SubscriptionItem["status"]) => {
    const styles = {
      active: "bg-green-500/20 text-green-400 border-green-500/30",
      trial: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      expired: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      cancelled: "bg-red-500/20 text-red-400 border-red-500/30"
    };

    const labels = {
      active: "فعال",
      trial: "تست (Trial)",
      expired: "منقضی شده",
      cancelled: "لغو شده"
    };

    return (
      <span className={`px-2.5 py-1 rounded-full border text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getVideoLevelBadge = (level?: string) => {
    if (!level) return null;
    const styles: Record<string, string> = {
      beginner: "bg-green-500/20 text-green-400 border-green-500/30",
      intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      advanced: "bg-red-500/20 text-red-400 border-red-500/30"
    };
    const labels: Record<string, string> = {
      beginner: "مبتدی",
      intermediate: "متوسط",
      advanced: "حرفه‌ای"
    };
    return (
      <span className={`px-2 py-0.5 rounded border text-[10px] ${styles[level] || styles.beginner}`}>
        {labels[level] || level}
      </span>
    );
  };

  
  const filteredVideos = videos.filter((vid) =>
    vid.title.toLowerCase().includes(searchVideoTerm.toLowerCase()) ||
    (vid.description && vid.description.toLowerCase().includes(searchVideoTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br bg-black/30 p-4 md:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl text-white mb-2" style={{ fontFamily: "Marbeh, sans-serif" }}>
              مدیریت اشتراک و ویدیوها
            </h1>
            <p className="text-white/60">تخصیص برنامه‌های ورزشی به کاربران و مدیریت بانک فیلم‌های آموزشی بدنسازی</p>
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

        
        <div className="border-b border-white/10 mb-6 flex gap-4">
          <button
            onClick={() => setActiveTab("subscriptions")}
            className={`pb-3 font-semibold text-sm transition-all border-b-2 px-2 flex items-center gap-2 ${
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
            className={`pb-3 font-semibold text-sm transition-all border-b-2 px-2 flex items-center gap-2 ${
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
                <div className="text-3xl text-white font-bold" style={{ fontFamily: "Marbeh, sans-serif" }}>
                  {formatNumber(stats.total)}
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60 text-sm">فعال</span>
                  <Check className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-3xl text-white font-bold" style={{ fontFamily: "Marbeh, sans-serif" }}>
                  {formatNumber(stats.active)}
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60 text-sm">آزمایشی (Trial)</span>
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-3xl text-white font-bold" style={{ fontFamily: "Marbeh, sans-serif" }}>
                  {formatNumber(stats.trial)}
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60 text-sm">منقضی شده</span>
                  <X className="w-5 h-5 text-red-400" />
                </div>
                <div className="text-3xl text-white font-bold" style={{ fontFamily: "Marbeh, sans-serif" }}>
                  {formatNumber(stats.expired)}
                </div>
              </div>
            </div>

            
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  placeholder="جستجو در نام، یوزرنیم، ایمیل یا شماره..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pr-10 pl-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 transition-colors text-sm"
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto py-1">
                <span className="text-white/60 text-sm whitespace-nowrap ml-2">وضعیت:</span>
                {["all", "active", "trial", "expired", "cancelled"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-4 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap ${
                      statusFilter === st
                        ? "bg-orange-500 border-orange-500 text-white"
                        : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    {st === "all"
                      ? "همه"
                      : st === "active"
                      ? "فعال"
                      : st === "trial"
                      ? "آزمایشی"
                      : st === "expired"
                      ? "منقضی شده"
                      : "لغو شده"}
                  </button>
                ))}
              </div>
            </div>

            
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-white/60 text-sm">
                      <th className="p-4 font-semibold">کاربر</th>
                      <th className="p-4 font-semibold">پکیج</th>
                      <th className="p-4 font-semibold">شروع</th>
                      <th className="p-4 font-semibold">پایان</th>
                      <th className="p-4 font-semibold">وضعیت</th>
                      <th className="p-4 font-semibold text-center">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center">
                          <div className="flex items-center justify-center gap-2 text-white/60">
                            <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                            <span>در حال بارگذاری اطلاعات...</span>
                          </div>
                        </td>
                      </tr>
                    ) : subscriptions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-white/40">
                          هیچ اشتراکی پیدا نشد
                        </td>
                      </tr>
                    ) : (
                      subscriptions.map((sub) => (
                        <tr key={sub._id} className="border-b border-white/5 hover:bg-white/5 transition-colors text-white text-sm">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-white shadow-md">
                                {sub.userId?.fullName?.charAt(0) || sub.userId?.username?.charAt(0) || "U"}
                              </div>
                              <div>
                                <div className="font-semibold text-white">
                                  {sub.userId?.fullName || "کاربر ناشناس"}
                                </div>
                                <div className="text-white/50 text-xs">
                                  @{sub.userId?.username || "username"} | {sub.userId?.phone || sub.userId?.email || "-"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-orange-400">
                              {sub.packageId?.name || "پکیج حذف شده"}
                            </span>
                          </td>
                          <td className="p-4 text-white/80">{formatDate(sub.startsAt)}</td>
                          <td className="p-4 text-white/80">{formatDate(sub.endsAt)}</td>
                          <td className="p-4">{getStatusBadge(sub.status)}</td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  if (sub.packageId) {
                                    handleOpenPlanModal(sub.packageId);
                                  } else {
                                    showAlert("خطا", "پکیج یافت نشد!", "error");
                                  }
                                }}
                                className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs transition-colors"
                              >
                                <Dumbbell className="w-3.5 h-3.5" />
                                برنامه تمرینی
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedSubscription(sub);
                                  setEditStatus(sub.status);
                                  setEditEndsAt(sub.endsAt ? new Date(sub.endsAt).toISOString().split("T")[0] : "");
                                  setShowEditModal(true);
                                }}
                                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs transition-colors"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                ویرایش
                              </button>
                              <button
                                onClick={() => handleDeleteSubscription(sub._id)}
                                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 p-1.5 rounded-lg transition-colors"
                                title="حذف اشتراک"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              
              {totalPages > 1 && (
                <div className="p-4 border-t border-white/10 bg-white/5 flex items-center justify-between">
                  <span className="text-white/60 text-xs">
                    نمایش صفحه {formatNumber(currentPage)} از {formatNumber(totalPages)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className="bg-white/5 border border-white/10 text-white p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className="bg-white/5 border border-white/10 text-white p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        
        {activeTab === "videos" && (
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
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                آپلود ویدیوی ورزشی جدید
              </button>
            </div>

            
            {loadingVideos ? (
              <div className="p-16 text-center text-white/60 flex items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                <span>در حال بارگذاری بانک ویدیوها...</span>
              </div>
            ) : filteredVideos.length === 0 ? (
              <div className="p-16 text-center border border-dashed border-white/10 rounded-2xl text-white/40 flex flex-col items-center justify-center">
                <Film className="w-12 h-12 text-white/10 mb-3" />
                <p className="text-sm">هیچ ویدیوی تمرینی ثبت نشده است. همین حالا اولین ویدیو را آپلود کنید!</p>
              </div>
            ) : (
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
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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
                        <h4 className="text-white font-bold text-sm line-clamp-1 mb-1" title={vid.title}>
                          {vid.title}
                        </h4>
                        <p className="text-white/50 text-xs line-clamp-2 leading-relaxed mb-4 min-h-[32px]">
                          {vid.description || "بدون توضیحات"}
                        </p>
                      </div>

                      <div className="flex gap-2 justify-between border-t border-white/5 pt-3">
                        <button
                          onClick={() => setWatchingVideo(vid)}
                          className="flex-1 bg-white/5 hover:bg-white/10 text-white py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors border border-white/10"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          پخش فیلم
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(vid._id)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 p-2 rounded-lg transition-colors"
                          title="حذف ویدیو"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        
        {showUploadVideoModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-gray-900/80 backdrop-blur-lg">
                <h2 className="text-xl text-white font-bold" style={{ fontFamily: "Marbeh, sans-serif" }}>
                  آپلود ویدیوی ورزشی جدید به آروان
                </h2>
                <button onClick={() => setShowUploadVideoModal(false)} className="text-white/60 hover:text-white" disabled={uploadingVideo}>✕</button>
              </div>

              {uploadingVideo ? (
                <div className="p-12 text-center text-white space-y-4">
                  <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto" />
                  <div className="font-bold text-sm">در حال آپلود ویدیو به سرورهای ابری آروان...</div>
                  <p className="text-white/50 text-xs">لطفاً پنجره را نبندید. آپلود فایل‌های حجیم ممکن است چند دقیقه طول بکشد.</p>
                </div>
              ) : (
                <form onSubmit={handleUploadVideo} className="p-6 space-y-4">
                  
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-xs mb-2 font-medium">فایل ویدیو (MP4)*</label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-xs mb-2 font-medium">فایل کاور (Thumbnail JPG/PNG)*</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-orange-500"
                        required
                      />
                    </div>
                  </div>

                  
                  <div>
                    <label className="block text-white/80 text-xs mb-2 font-medium">عنوان ویدیو*</label>
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
                    <label className="block text-white/80 text-xs mb-2 font-medium">توضیحات حرکت</label>
                    <textarea
                      placeholder="توضیح دهید حرکت چگونه انجام می‌شود..."
                      value={newVideoDesc}
                      onChange={(e) => setNewVideoDesc(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-xs focus:outline-none focus:border-orange-500 resize-none h-20"
                    />
                  </div>

                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-xs mb-2 font-medium">سطح سختی*</label>
                      <select
                        value={newVideoLevel}
                        onChange={(e) => setNewVideoLevel(e.target.value)}
                        className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2.5 text-white text-xs focus:outline-none focus:border-orange-500"
                      >
                        <option value="beginner">مبتدی (Beginner)</option>
                        <option value="intermediate">متوسط (Intermediate)</option>
                        <option value="advanced">حرفه‌ای (Advanced)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/80 text-xs mb-2 font-medium">مدت زمان (ثانیه)</label>
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
                    <label className="block text-white/80 text-xs mb-2 font-medium">تگ‌ها (با ویرگول انگلیسی جدا کنید)</label>
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
                      className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2.5 rounded-lg hover:opacity-90 font-medium text-sm"
                    >
                      شروع فرآیند آپلود
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowUploadVideoModal(false)}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-lg border border-white/10 text-sm"
                    >
                      انصراف
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        
        {watchingVideo && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-950 border border-white/10 rounded-2xl overflow-hidden w-full max-w-3xl relative">
              <div className="p-4 bg-black/40 flex justify-between items-center text-white border-b border-white/10">
                <h3 className="font-bold text-sm">{watchingVideo.title}</h3>
                <button
                  onClick={() => setWatchingVideo(null)}
                  className="bg-white/10 text-white p-1 rounded-full hover:bg-white/20"
                >
                  ✕
                </button>
              </div>
              <div className="aspect-video w-full bg-black relative flex items-center justify-center">
                <video
                  src={watchingVideo.url}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              </div>
              {watchingVideo.description && (
                <div className="p-4 bg-white/5 text-white text-xs leading-relaxed">
                  <p>{watchingVideo.description}</p>
                </div>
              )}
            </div>
          </div>
        )}

        
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-gray-900/80 backdrop-blur-lg">
                <h2 className="text-xl text-white font-bold" style={{ fontFamily: "Marbeh, sans-serif" }}>
                  ثبت اشتراک جدید (دستی)
                </h2>
                <button onClick={() => setShowCreateModal(false)} className="text-white/60 hover:text-white">✕</button>
              </div>
              <form onSubmit={handleCreateSubscription} className="p-6 space-y-4">
                
                <div>
                  <label className="block text-white/80 text-sm mb-2 font-medium">جستجو و انتخاب کاربر</label>
                  {selectedUser ? (
                    <div className="bg-white/5 border border-green-500/30 rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <div className="text-white font-semibold">{selectedUser.fullName || "کاربر بدون نام"}</div>
                        <div className="text-white/50 text-xs">@{selectedUser.username} | {selectedUser.phone || selectedUser.email}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedUser(null)}
                        className="bg-red-500/20 text-red-400 p-1 rounded hover:bg-red-500/30 transition-colors"
                      >
                        تغییر
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input
                        type="text"
                        placeholder="نام کاربری یا ایمیل کاربر..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pr-10 pl-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 text-sm"
                      />
                      {searchedUsers.length > 0 && (
                        <div className="absolute top-full right-0 left-0 bg-gray-800 border border-white/10 rounded-lg mt-1 overflow-hidden z-10 max-h-48 overflow-y-auto shadow-xl">
                          {searchedUsers.map((u) => (
                            <button
                              key={u._id}
                              type="button"
                              onClick={() => {
                                setSelectedUser(u);
                                setSearchedUsers([]);
                              }}
                              className="w-full text-right p-3 hover:bg-white/5 text-white border-b border-white/5 last:border-0 block"
                            >
                              <div className="font-semibold text-sm">{u.fullName || "بدون نام"}</div>
                              <div className="text-xs text-white/50">@{u.username} | {u.phone || u.email}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                
                <div>
                  <label className="block text-white/80 text-sm mb-2 font-medium">پکیج</label>
                  <select
                    value={selectedPackageId}
                    onChange={(e) => setSelectedPackageId(e.target.value)}
                    className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50"
                    required
                  >
                    <option value="">انتخاب پکیج...</option>
                    {packages.map((pkg) => (
                      <option key={pkg._id} value={pkg._id}>
                        {pkg.name}
                      </option>
                    ))}
                  </select>
                </div>

                
                <div>
                  <label className="block text-white/80 text-sm mb-2 font-medium">وضعیت اشتراک</label>
                  <select
                    value={createStatus}
                    onChange={(e) => setCreateStatus(e.target.value as SubscriptionItem["status"])}
                    className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50"
                  >
                    <option value="active">فعال</option>
                    <option value="trial">تست (Trial)</option>
                    <option value="expired">منقضی شده</option>
                  </select>
                </div>

                
                <div>
                  <label className="block text-white/80 text-sm mb-2 font-medium">تاریخ پایان (اختیاری - پیش‌فرض ۳۰ روز آینده)</label>
                  <input
                    type="date"
                    value={createEndsAt}
                    onChange={(e) => setCreateEndsAt(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2.5 rounded-lg hover:opacity-90 font-medium text-sm"
                  >
                    ثبت اشتراک
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-lg border border-white/10 text-sm"
                  >
                    انصراف
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        
        {showEditModal && selectedSubscription && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10 rounded-2xl max-w-md w-full">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-xl text-white font-bold" style={{ fontFamily: "Marbeh, sans-serif" }}>
                  ویرایش اشتراک کاربر
                </h2>
                <button onClick={() => setShowEditModal(false)} className="text-white/60 hover:text-white">✕</button>
              </div>
              <form onSubmit={handleEditSubscription} className="p-6 space-y-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-white font-medium">{selectedSubscription.userId?.fullName}</div>
                  <div className="text-white/50 text-xs">پکیج: {selectedSubscription.packageId?.name}</div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2 font-medium">وضعیت اشتراک</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as SubscriptionItem["status"])}
                    className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50"
                  >
                    <option value="active">فعال</option>
                    <option value="trial">تست (Trial)</option>
                    <option value="expired">منقضی شده</option>
                    <option value="cancelled">لغو شده</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2 font-medium">تاریخ پایان</label>
                  <input
                    type="date"
                    value={editEndsAt}
                    onChange={(e) => setEditEndsAt(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2.5 rounded-lg hover:opacity-90 font-medium text-sm"
                  >
                    ذخیره تغییرات
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-lg border border-white/10 text-sm"
                  >
                    انصراف
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        
        {showPlanModal && selectedPackageForPlan && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border border-white/10 rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">
              
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/30">
                <div>
                  <span className="text-xs text-orange-400 font-bold bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
                    پکیج: {selectedPackageForPlan.name}
                  </span>
                  <h2 className="text-2xl text-white font-bold mt-2" style={{ fontFamily: "Marbeh, sans-serif" }}>
                    مدیریت برنامه تمرینی
                  </h2>
                </div>
                <button
                  onClick={() => setShowPlanModal(false)}
                  className="bg-white/5 hover:bg-white/10 text-white/80 p-2 rounded-lg transition-colors border border-white/10"
                >
                  ✕
                </button>
              </div>

              
              <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-6 min-h-0">
                
                
                <div className="w-full lg:w-80 flex flex-col gap-4 border-l border-white/10 pl-0 lg:pl-6">
                  
                  
                  {!workoutPlan ? (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                      <p className="text-white/60 text-sm mb-4">برنامه تمرینی برای این پکیج ثبت نشده است.</p>
                      <form onSubmit={handleCreatePlan} className="space-y-3">
                        <input
                          type="text"
                          value={planForm.title}
                          onChange={(e) => setPlanForm({ ...planForm, title: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/40 text-xs focus:outline-none focus:border-orange-500"
                          placeholder="عنوان برنامه..."
                          required
                        />
                        <textarea
                          value={planForm.description}
                          onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/40 text-xs focus:outline-none focus:border-orange-500 resize-none h-16"
                          placeholder="توضیحات برنامه..."
                        />
                        <button
                          type="submit"
                          className="w-full bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors text-xs"
                        >
                          ایجاد برنامه تمرینی
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 relative">
                      {isEditingPlanInfo ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={planForm.title}
                            onChange={(e) => setPlanForm({ ...planForm, title: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-orange-500"
                            required
                          />
                          <textarea
                            value={planForm.description}
                            onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-orange-500 resize-none h-16"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleUpdatePlan}
                              className="flex-1 bg-green-500 text-white py-1 rounded text-xs hover:bg-green-600"
                            >
                              ذخیره
                            </button>
                            <button
                              onClick={() => setIsEditingPlanInfo(false)}
                              className="flex-1 bg-white/5 border border-white/10 text-white py-1 rounded text-xs"
                            >
                              انصراف
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-white font-bold text-sm truncate pr-16">{workoutPlan.title}</h3>
                            <div className="absolute top-4 left-4 flex gap-1">
                              <button
                                onClick={() => setIsEditingPlanInfo(true)}
                                className="text-blue-400 hover:bg-blue-500/15 p-1 rounded"
                                title="ویرایش توضیحات برنامه"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={handleDeletePlan}
                                className="text-red-400 hover:bg-red-500/15 p-1 rounded"
                                title="حذف برنامه تمرینی"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-white/60 text-xs leading-relaxed">{workoutPlan.description || "بدون توضیحات"}</p>
                        </div>
                      )}
                    </div>
                  )}

                  
                  {workoutPlan && (
                    <div className="flex-1 flex flex-col min-h-[300px]">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-white font-bold text-sm">روزهای تمرین</span>
                        <button
                          onClick={() => {
                            setEditingDay(null);
                            setDayForm({ dayName: `روز ${workoutDays.length + 1}`, muscleGroup: "", sortOrder: workoutDays.length + 1 });
                            setShowDayForm(true);
                          }}
                          className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          روز جدید
                        </button>
                      </div>

                      
                      {showDayForm && (
                        <form onSubmit={handleDaySubmit} className="bg-white/5 border border-white/10 rounded-xl p-3 mb-3 space-y-2.5">
                          <div className="text-white font-bold text-xs">
                            {editingDay ? "ویرایش روز تمرین" : "ثبت روز جدید"}
                          </div>
                          <div>
                            <input
                              type="text"
                              placeholder="نام روز (سینه / سرشانه / ...)"
                              value={dayForm.dayName}
                              onChange={(e) => setDayForm({ ...dayForm, dayName: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-orange-500"
                              required
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              placeholder="گروه عضلانی (مثلا: سینه، سرشانه، پا)"
                              value={dayForm.muscleGroup}
                              onChange={(e) => setDayForm({ ...dayForm, muscleGroup: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-orange-500"
                              required
                            />
                          </div>
                          <div>
                            <input
                              type="number"
                              placeholder="ترتیب نمایش"
                              value={dayForm.sortOrder}
                              onChange={(e) => setDayForm({ ...dayForm, sortOrder: Number(e.target.value) })}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-orange-500"
                              required
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 rounded text-xs"
                            >
                              {editingDay ? "بروزرسانی" : "افزودن"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowDayForm(false);
                                setEditingDay(null);
                              }}
                              className="flex-1 bg-white/10 hover:bg-white/15 text-white py-1 rounded text-xs"
                            >
                              انصراف
                            </button>
                          </div>
                        </form>
                      )}

                      
                      <div className="space-y-2 overflow-y-auto max-h-[350px]">
                        {workoutDays.length === 0 ? (
                          <div className="text-white/40 text-center text-xs p-6 border border-dashed border-white/10 rounded-lg">
                            روزی ثبت نشده است
                          </div>
                        ) : (
                          workoutDays.map((day) => (
                            <div
                              key={day._id}
                              onClick={() => {
                                setSelectedDay(day);
                                setExercises([]);
                                fetchExercises(day._id);
                                setShowExerciseForm(false);
                              }}
                              className={`p-3 rounded-lg border text-right cursor-pointer transition-all flex items-center justify-between ${
                                selectedDay?._id === day._id
                                  ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20"
                                  : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                              }`}
                            >
                              <div>
                                <div className="font-semibold text-xs">{day.dayName}</div>
                                <div className={`text-[10px] ${selectedDay?._id === day._id ? "text-white/80" : "text-white/50"}`}>
                                  عضله هدف: {day.muscleGroup}
                                </div>
                              </div>
                              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => {
                                    setEditingDay(day);
                                    setDayForm({ dayName: day.dayName, muscleGroup: day.muscleGroup, sortOrder: day.sortOrder });
                                    setShowDayForm(true);
                                  }}
                                  className={`p-1 rounded ${selectedDay?._id === day._id ? "hover:bg-white/20 text-white" : "hover:bg-white/5 text-blue-400"}`}
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteDay(day._id)}
                                  className={`p-1 rounded ${selectedDay?._id === day._id ? "hover:bg-white/20 text-white" : "hover:bg-white/5 text-red-400"}`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                
                <div className="flex-1 flex flex-col min-h-[300px]">
                  {!selectedDay ? (
                    <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl p-8 text-center text-white/40">
                      <Dumbbell className="w-12 h-12 mb-3 text-white/20" />
                      <p className="text-sm">برای مدیریت و مشاهده تمرینات، یک روز را از ستون کناری انتخاب کنید</p>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col h-full">
                      
                      <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
                        <div>
                          <span className="text-white font-bold text-sm block">تمرین‌های {selectedDay.dayName}</span>
                          <span className="text-xs text-white/50">گروه هدف: {selectedDay.muscleGroup}</span>
                        </div>
                        <button
                          onClick={() => {
                            setEditingExercise(null);
                            setExerciseForm({ name: "", sets: 3, reps: "12-10-8", restSec: 60, videoId: "", videoId2: "", sortOrder: exercises.length + 1 });
                            setShowExerciseForm(true);
                          }}
                          className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          حرکت تمرینی جدید
                        </button>
                      </div>

                      
                      {showExerciseForm && (
                        <form onSubmit={handleExerciseSubmit} className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4 space-y-3">
                          <div className="text-white font-bold text-xs">
                            {editingExercise ? "ویرایش حرکت ورزشی" : "ثبت حرکت ورزشی جدید"}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-white/70 text-[10px] mb-1">نام حرکت</label>
                              <input
                                type="text"
                                placeholder="مثلا: نشر جانب دمبل ایستاده"
                                value={exerciseForm.name}
                                onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-orange-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-white/70 text-[10px] mb-1">ویدیو آموزشی ۱</label>
                              <select
                                value={exerciseForm.videoId}
                                onChange={(e) => setExerciseForm({ ...exerciseForm, videoId: e.target.value })}
                                className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-orange-500"
                              >
                                <option value="">بدون ویدیو اول</option>
                                {videos.map((vid) => (
                                  <option key={vid._id} value={vid._id}>
                                    {vid.title} ({getVideoLevelBadge(vid.level)?.props.children || "مبتدی"})
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-white/70 text-[10px] mb-1">ویدیو آموزشی ۲ (اختیاری)</label>
                              <select
                                value={exerciseForm.videoId2}
                                onChange={(e) => setExerciseForm({ ...exerciseForm, videoId2: e.target.value })}
                                className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-orange-500"
                              >
                                <option value="">بدون ویدیو دوم</option>
                                {videos.map((vid) => (
                                  <option key={vid._id} value={vid._id}>
                                    {vid.title} ({getVideoLevelBadge(vid.level)?.props.children || "مبتدی"})
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div>
                              <label className="block text-white/70 text-[10px] mb-1">تعداد ست</label>
                              <input
                                type="number"
                                placeholder="۳"
                                value={exerciseForm.sets}
                                onChange={(e) => setExerciseForm({ ...exerciseForm, sets: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-orange-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-white/70 text-[10px] mb-1">تعداد تکرار</label>
                              <input
                                type="text"
                                placeholder="12-10-8 یا ۱۲"
                                value={exerciseForm.reps}
                                onChange={(e) => setExerciseForm({ ...exerciseForm, reps: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-orange-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-white/70 text-[10px] mb-1">استراحت (ثانیه)</label>
                              <input
                                type="number"
                                placeholder="۶۰"
                                value={exerciseForm.restSec}
                                onChange={(e) => setExerciseForm({ ...exerciseForm, restSec: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-orange-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-white/70 text-[10px] mb-1">ترتیب نمایش</label>
                              <input
                                type="number"
                                value={exerciseForm.sortOrder}
                                onChange={(e) => setExerciseForm({ ...exerciseForm, sortOrder: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-orange-500"
                                required
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 justify-end pt-2">
                            <button
                              type="submit"
                              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-xs font-semibold"
                            >
                              {editingExercise ? "ثبت تغییرات" : "افزودن به برنامه"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowExerciseForm(false);
                                setEditingExercise(null);
                              }}
                              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-5 py-2 rounded-lg text-xs"
                            >
                              انصراف
                            </button>
                          </div>
                        </form>
                      )}

                      
                      <div className="flex-1 overflow-y-auto max-h-[450px] space-y-3">
                        {exercises.length === 0 ? (
                          <div className="text-white/40 text-center text-xs p-12 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-white/20 mb-2" />
                            هنوز حرکتی برای این روز ثبت نشده است. با زدن دکمه «حرکت تمرینی جدید» اضافه کنید.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-3">
                            {exercises.map((ex) => (
                              <div
                                key={ex._id}
                                className="bg-white/5 border border-white/5 hover:border-white/10 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:bg-white/10"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-lg flex items-center justify-center font-bold text-sm">
                                    {ex.sortOrder}
                                  </div>
                                  <div>
                                    <h4 className="text-white font-bold text-sm">{ex.name}</h4>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-white/50 text-[10px] mt-1">
                                      <span>ست‌ها: <strong className="text-white">{ex.sets}</strong></span>
                                      <span>|</span>
                                      <span>تکرارها: <strong className="text-white">{ex.reps}</strong></span>
                                      <span>|</span>
                                      <span>استراحت: <strong className="text-white">{ex.restSec} ثانیه</strong></span>
                                      {ex.videoId && (
                                        <>
                                          <span>|</span>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              if (ex.videoId) {
                                                setWatchingVideo(ex.videoId);
                                              }
                                            }}
                                            className="text-orange-400 hover:text-orange-300 flex items-center gap-0.5 font-semibold cursor-pointer"
                                          >
                                            <Play className="w-3 h-3 fill-current" />
                                            ویدیو ۱: {ex.videoId.title}
                                          </button>
                                        </>
                                      )}
                                      {ex.videoId2 && (
                                        <>
                                          <span>|</span>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              if (ex.videoId2) {
                                                setWatchingVideo(ex.videoId2);
                                              }
                                            }}
                                            className="text-pink-400 hover:text-pink-300 flex items-center gap-0.5 font-semibold cursor-pointer"
                                          >
                                            <Play className="w-3 h-3 fill-current" />
                                            ویدیو ۲: {ex.videoId2.title}
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2 w-full md:w-auto justify-end border-t border-white/5 pt-2.5 md:pt-0 md:border-0">
                                  <button
                                    onClick={() => {
                                      setEditingExercise(ex);
                                      setExerciseForm({
                                        name: ex.name,
                                        sets: ex.sets,
                                        reps: ex.reps,
                                        restSec: ex.restSec,
                                        videoId: ex.videoId ? ex.videoId._id : "",
                                        videoId2: ex.videoId2 ? ex.videoId2._id : "",
                                        sortOrder: ex.sortOrder
                                      });
                                      setShowExerciseForm(true);
                                    }}
                                    className="bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                    ویرایش
                                  </button>
                                  <button
                                    onClick={() => handleDeleteExercise(ex._id)}
                                    className="bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/20 p-1.5 rounded-lg transition-colors"
                                    title="حذف حرکت"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
