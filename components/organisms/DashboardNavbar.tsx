"use client";

import React, { useState } from "react";
import { Icon } from "../atoms/Icon";
import { Logo } from "../molecules/Logo";
import { Avatar } from "../atoms/Avatar";
import Link from "next/link";
import { logout } from "@/lib/actions/auth";

interface DashboardNavbarProps {
  user: any;
}

export const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: "Cari Proyek", href: "/cari-proyek", ownerOnly: false },
    { name: "Posting Proyek", href: "/dashboard/post-job", ownerOnly: true },
    { name: "Dashboard Saya", href: "/dashboard", ownerOnly: false },
  ];

  const filteredItems = menuItems.filter(item => !item.ownerOnly || user?.role === "OWNER");

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant flex justify-between items-center px-6 md:px-8 h-20 max-w-full mx-auto">
        <div className="flex items-center gap-8">
          <Logo />
          <div className="hidden md:flex gap-6">
            {filteredItems.map(item => (
              <a 
                key={item.href}
                className="text-on-surface font-medium opacity-80 hover:text-secondary transition-colors duration-300" 
                href={item.href}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-primary leading-tight">
                {user?.name || "User"}
              </p>
              <p className="text-[10px] text-on-surface-variant uppercase font-black tracking-widest text-right opacity-60">
                {user?.role === "OWNER" ? "Project Owner" : user?.role === "ADMIN" ? "Administrator" : "Student"}
              </p>
            </div>
            <Avatar 
              src={user?.image || "https://img.icons8.com/parakeet/96/user.png"} 
              alt={user?.name || "User"} 
              verified={user?.isVerified}
            />
          </div>

          {/* Hamburger for Dashboard (when sidebar is hidden on mobile) */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-primary hover:bg-primary/10 rounded-lg transition-all"
          >
            <Icon name={isMenuOpen ? "close" : "menu"} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer for Dashboard */}
      <div className={`fixed inset-0 top-20 bg-surface z-[48] transition-all duration-500 ease-in-out lg:hidden ${
        isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
      }`}>
        <div className="flex flex-col p-8 gap-8 h-full overflow-y-auto">
          <div className="space-y-6">
             <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Main Menu</p>
             <div className="flex flex-col gap-6">
                {filteredItems.map(item => (
                  <Link 
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-2xl font-headline font-extrabold text-primary"
                  >
                    {item.name}
                  </Link>
                ))}
             </div>
          </div>
          
          <div className="mt-auto border-t border-outline-variant/10 pt-8 pb-12">
             <div className="flex items-center gap-4 mb-8">
                <Avatar 
                  src={user?.image || "https://img.icons8.com/parakeet/96/user.png"} 
                  alt={user?.name || "User"} 
                  verified={user?.isVerified}
                  size="lg"
                />
                <div>
                   <p className="font-bold text-lg text-primary">{user?.name}</p>
                   <p className="text-xs text-on-surface-variant">{user?.email}</p>
                </div>
             </div>
             <Link 
               href="/dashboard/profile"
               onClick={() => setIsMenuOpen(false)}
               className="flex items-center gap-3 p-4 bg-surface-container-low rounded-xl font-bold text-primary mb-3"
             >
                <Icon name="person" />
                Edit Profil
             </Link>
             <button 
               onClick={() => logout()}
               className="w-full flex items-center gap-3 p-4 text-error font-bold"
             >
                <Icon name="logout" />
                Keluar Sesi
             </button>
          </div>
        </div>
      </div>
    </>
  );
};
