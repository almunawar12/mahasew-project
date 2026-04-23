import React from "react";
import { getAllProjectsAdmin } from "@/lib/actions/admin";
import { Icon } from "@/components/atoms/Icon";
import { ProjectModerationList } from "@/components/organisms/ProjectModerationList";

export default async function AdminModerationPage() {
  const projects = await getAllProjectsAdmin();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="font-headline text-[2.5rem] font-extrabold text-primary leading-tight -tracking-widest">
          Moderasi <span className="text-secondary-container">Proyek</span>
        </h1>
        <p className="text-on-surface-variant text-lg max-w-xl mt-2">
          Pantau seluruh proyek yang diposting, hapus konten yang melanggar ketentuan, dan kelola kualitas listings.
        </p>
      </header>

      <section className="space-y-6">
        <ProjectModerationList projects={projects} />
      </section>
    </div>
  );
}
