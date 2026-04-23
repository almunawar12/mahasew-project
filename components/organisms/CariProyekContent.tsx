"use client";

import React from "react";
import { useProjects } from "@/hooks/useProjects";
import { ProjectCard } from "@/components/organisms/ProjectCard";
import { Icon } from "@/components/atoms/Icon";

export const CariProyekContent = () => {
  const { data: projects, isLoading, isError, error, refetch } = useProjects();

  // Format Prisma data to match ProjectCard expectations
  const formattedProjects = projects?.map((p: any) => ({
    id: p.id,
    title: p.title,
    clientName: p.client?.name || "Client",
    clientAffiliation: p.client?.profile?.university || "MahaSewa User",
    clientLogo: p.client?.profile?.avatarUrl || "https://img.icons8.com/parakeet/96/user.png",
    budget: `Rp ${p.budget.toLocaleString("id-ID")}`,
    deadline: p.deadline ? new Date(p.deadline).toLocaleDateString("id-ID") : "Flexible",
    skills: ["General"], // Default if not specified in basic fetch
    variant: "standard",
    description: p.description,
  }));

  return (
    <main className="flex-grow container mx-auto px-4 pt-32 pb-12">
      <header className="mb-12">
        <h1 className="font-headline text-4xl font-extrabold text-primary mb-4">
          Cari Proyek
        </h1>
        <p className="text-on-surface-variant max-w-2xl">
          Temukan peluang proyek sampingan terbaik di seluruh Indonesia. Mulailah membangun portofolio Anda hari ini.
        </p>
      </header>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-surface-container-low rounded-xl p-8 animate-pulse border border-outline-variant/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-surface-container-high" />
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-surface-container-high rounded" />
                  <div className="h-3 w-16 bg-surface-container-high rounded" />
                </div>
              </div>
              <div className="h-6 w-full bg-surface-container-high rounded mb-4" />
              <div className="h-4 w-3/4 bg-surface-container-high rounded" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-20 bg-error-container/10 rounded-2xl border border-error/20">
          <Icon name="error" className="text-error text-5xl mb-4" />
          <h2 className="text-xl font-bold text-error mb-2">Terjadi Kesalahan</h2>
          <p className="text-on-error-container mb-6">{(error as Error).message}</p>
          <button 
            onClick={() => refetch()}
            className="bg-primary text-on-primary px-6 py-2 rounded-full font-bold hover:brightness-110 transition-all"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {!isLoading && !isError && formattedProjects?.length === 0 && (
        <div className="text-center py-20">
          <Icon name="search_off" className="text-outline text-5xl mb-4" />
          <h2 className="text-xl font-bold text-on-surface mb-2">Tidak Ada Proyek</h2>
          <p className="text-on-surface-variant">Belum ada proyek yang tersedia saat ini.</p>
        </div>
      )}

      {!isLoading && !isError && formattedProjects && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formattedProjects.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </main>
  );
};
