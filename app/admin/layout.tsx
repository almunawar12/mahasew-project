import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layouts/DashboardLayout";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}
