import React from "react";
import { Sidebar } from "../organisms/Sidebar";
import { auth } from "@/auth";
import { Avatar } from "../atoms/Avatar";
import { Logo } from "../molecules/Logo";

import { DashboardNavbar } from "../organisms/DashboardNavbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex h-screen bg-surface-container-lowest overflow-hidden">
      {/* Top Navigation Bar */}
      <DashboardNavbar user={user} />

      {/* Sidebar - Pushed down by TopBar */}
      <aside className="mt-20 hidden lg:block w-64 flex-shrink-0 border-r border-outline-variant/10">
        <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
          <Sidebar role={user?.role} userName={user?.name} userImage={user?.image} isVerified={user?.isVerified} />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0 mt-20">
        {/* Content Scroll Area */}
        <main className="flex-grow overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
