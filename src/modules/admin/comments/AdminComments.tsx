"use client";
import React from "react";
import CommentList from "./CommentList";

export default function AdminComments() {
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

        <CommentList />
      </div>
    </div>
  );
}
