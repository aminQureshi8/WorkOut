"use client";
import { createContext, useContext, useState } from "react";

const SidebarContext = createContext({ isOpen: true, onToggle: () => {} });

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <SidebarContext.Provider
      value={{ isOpen, onToggle: () => setIsOpen(!isOpen) }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
