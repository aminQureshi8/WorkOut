import React from "react";

export interface SidebarCounts {
  users: number;
  subscriptions: number;
  articles: number;
  comments: number;
  wishlist: number;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badge: string | null;
  href: string;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}
