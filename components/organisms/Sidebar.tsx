"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "../atoms/Icon";
import { logout } from "@/lib/actions/auth";

interface SidebarProps {
  role: string | undefined;
  userName?: string | null;
  userImage?: string | null;
  isVerified?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, userName, userImage, isVerified }) => {
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
  };

  const userMenuItems = [
    { name: "Ringkasan", icon: "dashboard", href: "/dashboard" },
    { name: "Cari Proyek", icon: "search", href: "/cari-proyek" },
    { name: "Lamaran Saya", icon: "work", href: "/dashboard/my-applications" },
    { name: "Profil Saya", icon: "person", href: "/dashboard/profile" },
  ];

  const ownerMenuItems = [
    { name: "Ringkasan", icon: "dashboard", href: "/dashboard" },
    { name: "Proyek Aktif", icon: "work", href: "/dashboard/manage-projects" },
    { name: "Daftar Pelamar", icon: "people", href: "/dashboard/applicants" },
    { name: "Manajemen Tim", icon: "group", href: "/dashboard/team" },
    { name: "Analitik", icon: "trending_up", href: "/dashboard/analytics" },
  ];

  const adminMenuItems = [
    { name: "Admin Home", icon: "admin_panel_settings", href: "/admin" },
    { name: "User Management", icon: "group", href: "/admin/users" },
    { name: "Moderasi Proyek", icon: "verified", href: "/admin/moderation" },
    { name: "Statistik", icon: "monitoring", href: "/admin/stats" },
  ];

  const menuItems = 
    role === "ADMIN" ? adminMenuItems : 
    role === "OWNER" ? ownerMenuItems : 
    userMenuItems;

  const isOwner = role === "OWNER";

  return (
    <aside className="w-64 bg-surface flex flex-col h-full py-6">
      {/* Action Section */}
      <div className="px-6 mb-8">
        {isOwner && (
          <Link 
            href="/dashboard/post-job"
            className="w-full py-3 bg-secondary-container text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Icon name="add" className="text-sm" />
            Posting Proyek Baru
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-grow flex flex-col gap-1 px-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-secondary text-white shadow-sm font-bold"
                  : "text-on-surface hover:bg-surface-container-low"
              }`}
            >
              <Icon
                name={item.icon}
                fill={isActive}
                className={isActive ? "text-white" : "text-on-surface-secondary"}
              />
              <span className="text-sm font-medium">{item.name}</span>
            </a>
          );
        })}
      </nav>

      {/* Footer Nav & Logout */}
      <div className="mt-auto px-4 border-t border-outline-variant/10 pt-4 space-y-1">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-4 py-2 text-on-surface hover:bg-surface-container-low rounded-lg transition-all duration-200"
        >
          <Icon name="settings" />
          <span className="text-sm font-medium">Pengaturan</span>
        </Link>
        <Link
          href="/help"
          className="flex items-center gap-3 px-4 py-2 text-on-surface hover:bg-surface-container-low rounded-lg transition-all duration-200"
        >
          <Icon name="help_outline" />
          <span className="text-sm font-medium">Bantuan</span>
        </Link>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 mt-2 rounded-lg text-error hover:bg-error/10 transition-all duration-200 group font-bold"
        >
          <Icon name="logout" className="group-hover:translate-x-1 transition-transform" />
          <span className="text-sm">Keluar Akun</span>
        </button>
      </div>
    </aside>
  );
};
