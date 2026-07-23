"use client";
import React from "react";
import { CheckCircle, Clock } from "lucide-react";
import type { ViewCommentModalProps } from "@/types/comment";

export default function ViewCommentModal({
  isOpen,
  comment,
  onClose,
}: ViewCommentModalProps) {
  if (!isOpen || !comment) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10 rounded-2xl max-w-2xl w-full overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2
            className="text-2xl text-white font-bold"
            style={{ fontFamily: "Marbeh, sans-serif" }}
          >
            مشاهده دیدگاه
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors text-xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-white/80 mb-2 text-sm font-medium">
              متن کامل دیدگاه
            </label>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm leading-relaxed whitespace-pre-line max-h-60 overflow-y-auto">
              {comment.text}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer text-sm font-medium"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
}
