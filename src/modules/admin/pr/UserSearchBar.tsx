"use client";

import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

export default function UserSearchBar() {
  const [users, setUsers] = useState<any[]>([]);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fethUsers = async () => {
      const res = await fetch(
        `/api/admin/user/pr?search=${encodeURIComponent(debouncedSearchQuery)}`
      );
      const data = await res.json();
      setUsers(data);
    };
    fethUsers();
  }, [debouncedSearchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="relative w-full md:w-72">
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder="جستجوی کاربر..."
          className="w-full bg-gray-900 border border-white/10 rounded-xl pr-10 pl-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500 text-sm font-sans"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-white/40">
          <Search className="w-4 h-4" />
        </div>
      </div>

      {isOpen && search.trim() !== "" && users.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-gray-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="p-3 border-b border-white/5 text-white/40 text-xs">
            نتایج جستجو
          </div>
          <div className="divide-y divide-white/5 max-h-60 overflow-y-auto">
            {users.map((sub: any) => {
              const user = sub.userId;
              if (!user) return null;
              return (
                <div
                  key={sub._id}
                  className="p-3 hover:bg-white/5 transition-colors cursor-pointer flex justify-between items-center"
                >
                  <div>
                    <div className="text-white text-sm font-medium">
                      {user.fullName}
                    </div>
                    <div className="text-white/40 text-xs font-sans mt-0.5">
                      @{user.username}
                    </div>
                  </div>
                  <div className="text-purple-400 text-xs font-sans">
                    {user.email || "بدون ایمیل"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
