"use client";
import { useSidebar } from "./SidebarContext";

export default function MainWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen } = useSidebar();
  return (
    <main
      className={`flex-1 overflow-y-auto transition-all duration-300 ${
        isOpen ? "mr-64" : "mr-20"
      }`}
    >
      {children}
    </main>
  );
}
