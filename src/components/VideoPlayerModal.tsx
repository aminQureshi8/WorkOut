"use client";
import React from "react";
import { VideoPlayerModalProps } from "@/types/workout";

export default function VideoPlayerModal({ video, onClose }: VideoPlayerModalProps) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-955 to-gray-900 border border-white/10 rounded-2xl w-full max-w-4xl overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
          <span className="text-white font-bold">{video.title}</span>
          <button
            type="button"
            onClick={onClose}
            className="bg-white/5 hover:bg-white/10 text-white/80 p-2 rounded-lg transition-colors border border-white/10 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="aspect-video w-full bg-black relative">
          <video
            src={video.url}
            controls
            autoPlay
            poster={video.thumbnailUrl}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="p-4 bg-black/20 text-right">
          <p className="text-white/60 text-xs leading-relaxed">
            {video.description || "بدون توضیحات"}
          </p>
        </div>
      </div>
    </div>
  );
}
