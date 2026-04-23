import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prismadb";
import { ProjectList } from "@/components/organisms/ProjectList";
import { Icon } from "@/components/atoms/Icon";
import Link from "next/link";

export default async function ManageProjectsPage() {
  const session = await auth();

  if (!session || session.user?.role !== "OWNER") {
    redirect("/dashboard");
  }

  // Fetch real projects from DB
  const projects = await prisma.project.findMany({
    where: {
      clientId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline text-3xl font-extrabold text-primary leading-tight">
            Kelola <span className="text-secondary-container">Proyek</span>
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Lihat, edit, atau hapus lowongan proyek yang telah Anda posting.
          </p>
        </div>
        <Link 
          href="/dashboard/post-job"
          className="px-6 py-2.5 bg-primary-container text-white rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary transition-all shadow-sm"
        >
          <Icon name="add" />
          Posting Baru
        </Link>
      </header>

      <section>
        <ProjectList projects={projects} />
      </section>
    </div>
  );
}
