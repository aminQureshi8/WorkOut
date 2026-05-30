"use client";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { BiUser, BiLogOut, BiCog } from "react-icons/bi";
import { MdDashboard } from "react-icons/md";
import Image from "next/image";

export default function UserDropdown({
  username,
  avatar,
  email,
}: {
  username: string;
  avatar: string;
  email: string;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        portalRef.current &&
        !portalRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleToggle = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      });
    }
    setOpen((p) => !p);
  };

  const dropdown = (
    <div
      ref={portalRef}
      style={{ top: pos.top, left: pos.left }}
      className="absolute w-56 bg-gray-900 border border-white/10 rounded-xl shadow-xl z-[9999] overflow-hidden"
      dir="rtl"
    >
      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
        {avatar ? (
          <Image
            src={avatar}
            alt="avatar"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover border-2 border-orange-500"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
            <BiUser className="w-6 h-6 text-white" />
          </div>
        )}
        <div className="overflow-hidden">
          <p className="text-white text-sm font-medium truncate">{username}</p>
          <p className="text-white/40 text-xs truncate">{email}</p>
        </div>
      </div>

      <div className="py-1">
        <Link
          href="/dashboard"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-4 py-2.5 text-white/80 hover:bg-white/5 hover:text-orange-500 transition-colors text-sm"
        >
          <MdDashboard className="w-4 h-4" />
          داشبورد
        </Link>
        <Link
          href="/dashboard/profile"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-4 py-2.5 text-white/80 hover:bg-white/5 hover:text-orange-500 transition-colors text-sm"
        >
          <BiCog className="w-4 h-4" />
          تنظیمات پروفایل
        </Link>
      </div>

      <div className="border-t border-white/10 py-1">
        <button
          onClick={() =>
            signOut({
              redirect: true,
              callbackUrl: "/login",
            })
          }
          className="flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors text-sm w-full"
        >
          <BiLogOut className="w-4 h-4" />
          خروج از حساب
        </button>
      </div>
    </div>
  );

  return (
    <div ref={ref}>
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        {avatar ? (
          <Image
            src={avatar}
            alt="avatar"
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover border-2 border-orange-500"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center">
            <BiUser className="w-5 h-5 text-white" />
          </div>
        )}
        <span className="text-white text-sm hidden md:block">{username}</span>
        <svg
          className={`w-4 h-4 text-white/60 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open &&
        typeof window !== "undefined" &&
        createPortal(dropdown, document.body)}
    </div>
  );
}
