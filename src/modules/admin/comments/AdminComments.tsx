"use client";
import React, { useState, useEffect, useCallback } from "react";
import { showAlert, showConfirm } from "@/utils/alert";
import { AdminComment, AdminCommentStats } from "@/types/comment";
import CommentStats from "./CommentStats";
import EditCommentModal from "./EditCommentModal";
import CommentList from "./CommentList";

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("fa-IR").format(num);
};

export default function AdminComments() {
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [stats, setStats] = useState<AdminCommentStats>({
    totalCount: 0,
    approvedCount: 0,
    pendingCount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [filterApproved, setFilterApproved] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalComments, setTotalComments] = useState(0);

  const [editingComment, setEditingComment] = useState<AdminComment | null>(
    null,
  );
  const [editText, setEditText] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let url = `/api/admin/comment?page=${currentPage}&limit=10`;
      if (filterApproved !== "all") {
        url += `&isApproved=${filterApproved}`;
      }
      if (debouncedSearchQuery.trim()) {
        url += `&search=${encodeURIComponent(debouncedSearchQuery)}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("خطا در دریافت لیست دیدگاه‌ها");
      const data = await res.json();
      setComments(data.comments || []);
      setTotalPages(data.totalPages || 1);
      setTotalComments(data.total || 0);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err: any) {
      setError(err.message || "دریافت اطلاعات با خطا مواجه شد");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filterApproved, debouncedSearchQuery]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleToggleApproval = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    const confirm = await showConfirm({
      title: nextStatus
        ? "آیا از تایید این کامنت مطمئن هستید؟"
        : "آیا از عدم تایید این کامنت مطمئن هستید؟",
      text: nextStatus
        ? "پس از تایید، این کامنت در سایت برای عموم نمایش داده خواهد شد."
        : "پس از عدم تایید، این کامنت از سایت مخفی خواهد شد.",
      icon: "question",
      confirmButtonText: nextStatus ? "بله، تایید شود" : "بله، لغو تایید شود",
      confirmButtonColor: nextStatus ? "#10b981" : "#eab308",
    });

    if (confirm) {
      try {
        const res = await fetch("/api/admin/comment", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, isApproved: nextStatus }),
        });

        if (res.ok) {
          showAlert({
            title: nextStatus ? "تایید شد" : "لغو تایید شد",
            text: nextStatus
              ? "دیدگاه با موفقیت تایید شد."
              : "تایید دیدگاه با موفقیت لغو شد.",
            icon: "success",
            confirmButtonColor: "#7c3aed",
          });
          fetchComments();
        } else {
          throw new Error("خطا در بروزرسانی وضعیت");
        }
      } catch (err: any) {
        showAlert({
          title: "خطا",
          text: err.message || "بروزرسانی با خطا مواجه شد.",
          icon: "error",
          confirmButtonColor: "#7c3aed",
        });
      }
    }
  };

  const handleEdit = (comment: AdminComment) => {
    setEditingComment(comment);
    setEditText(comment.text);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingComment || !editText.trim()) return;

    try {
      const res = await fetch("/api/admin/comment", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingComment._id, text: editText }),
      });

      if (res.ok) {
        showAlert({
          title: "ذخیره شد",
          text: "متن دیدگاه با موفقیت ویرایش شد.",
          icon: "success",
          confirmButtonColor: "#7c3aed",
        });
        setShowEditModal(false);
        setEditingComment(null);
        fetchComments();
      } else {
        throw new Error("خطا در ذخیره متن دیدگاه");
      }
    } catch (err: any) {
      showAlert({
        title: "خطا",
        text: err.message || "خطایی رخ داد.",
        icon: "error",
        confirmButtonColor: "#7c3aed",
      });
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = await showConfirm({
      title: "آیا مطمئن هستید؟",
      text: "این عمل غیرقابل بازگشت است و کامنت حذف خواهد شد.",
      icon: "warning",
      confirmButtonText: "بله، حذف شود",
    });

    if (confirm) {
      try {
        const res = await fetch(`/api/admin/comment?id=${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          showAlert({
            title: "حذف شد",
            text: "دیدگاه با موفقیت حذف شد.",
            icon: "success",
            confirmButtonColor: "#7c3aed",
          });
          fetchComments();
        } else {
          throw new Error("خطا در حذف دیدگاه");
        }
      } catch (err: any) {
        showAlert({
          title: "خطا",
          text: err.message || "حذف با خطا مواجه شد.",
          icon: "error",
          confirmButtonColor: "#7c3aed",
        });
      }
    }
  };

  return (
    <div className="overflow-hidden font-danaMed" dir="rtl">
      <div className="container mx-auto pt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1
              className="text-3xl font-bold text-white mb-2"
              style={{ fontFamily: "Marbeh, sans-serif" }}
            >
              مدیریت دیدگاه‌ها
            </h1>
            <p className="text-white/60 text-sm">
              دیدگاه‌های کاربران را در اینجا مدیریت، ویرایش و تایید کنید.
            </p>
          </div>
        </div>

        <CommentStats stats={stats} formatNumber={formatNumber} />

        <CommentList
          comments={comments}
          isLoading={isLoading}
          error={error}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterApproved={filterApproved}
          setFilterApproved={setFilterApproved}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          totalComments={totalComments}
          onToggleApproval={handleToggleApproval}
          onEdit={handleEdit}
          onDelete={handleDelete}
          formatNumber={formatNumber}
        />
      </div>

      <EditCommentModal
        isOpen={showEditModal}
        comment={editingComment}
        editText={editText}
        onChangeText={setEditText}
        onClose={() => {
          setShowEditModal(false);
          setEditingComment(null);
        }}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
