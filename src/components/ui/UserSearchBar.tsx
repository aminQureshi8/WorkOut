"use client";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function UserSearchBar() {
  const [users, setUsers] = useState([]);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fethUsers = async () => {
      const res = await fetch(
        `/api/admin/user/pr?search=${encodeURIComponent(debouncedSearchQuery)}`,
      );
      const data = await res.json();
      setUsers(data);
    };
  }, [debouncedSearchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="relative w-full md:w-72">
      <input
        type="text"
        placeholder="جستجوی کاربر..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-gray-900 border border-white/10 rounded-xl pr-10 pl-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500 text-sm font-sans"
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-white/40">
        <Search className="w-4 h-4" />
      </div>
    </div>
  );
}
