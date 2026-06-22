"use client";
import React from "react";
import { AdminComment } from "@/types/comment";

interface EditCommentModalProps {
  isOpen: boolean;
  comment: AdminComment | null;
  editText: string;
  onChangeText: (text: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export default function EditCommentModal({
  isOpen,
  comment,
  editText,
  onChangeText,
  onClose,
  onSave,
}: EditCommentModalProps) {
  if (!isOpen || !comment) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10 rounded-2xl max-w-2xl w-full">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-2xl text-white font-bold" style={{ fontFamily: "Marbeh, sans-serif" }}>
            ویرایش دیدگاه
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors text-xl"
          >
            ✕
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center text-white text-lg font-bold">
              {comment.name ? comment.name.charAt(0) : "👤"}
            </div>
            <div>
              <div className="text-white font-medium">{comment.name}</div>
              <div className="text-white/60 text-xs ss02">
                {new Date(comment.createdAt).toLocaleDateString("fa-IR")}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-white mb-2 text-sm">متن دیدگاه</label>
            <textarea
              rows={6}
              value={editText}
              onChange={(e) => onChangeText(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 resize-none leading-relaxed"
              placeholder="متن دیدگاه را وارد کنید..."
            />
          </div>
        </div>
        
        {/* Actions */}
        <div className="p-6 border-t border-white/10 flex gap-3">
          <button
            onClick={onSave}
            className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all font-medium cursor-pointer"
          >
            ذخیره تغییرات
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors cursor-pointer"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}
