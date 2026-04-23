import React from 'react';
import { ProjectCard } from './ProjectCard';
import { projects as staticProjects } from '../../lib/data';
import { Icon } from '../atoms/Icon';
import { getActiveProjects } from '@/lib/actions/project';
import { formatRupiah } from '@/lib/utils';

export const ProjectGrid = async () => {
  const dbProjects = await getActiveProjects();

  const mappedDbProjects = dbProjects.map((p) => ({
    id: p.id,
    title: p.title,
    clientName: p.client.name || "Anonymous",
    clientAffiliation: p.client.profile?.university || "Independent",
    clientLogo: p.client.image || "https://ui-avatars.com/api/?name=" + (p.client.name || "A"),
    budget: formatRupiah(p.budget),
    deadline: p.deadline ? `${Math.ceil((p.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} Days` : "No Deadline",
    skills: p.skills,
    variant: "standard" as "standard",
    description: p.description
  }));

  // Show DB projects first, then static ones for demo if needed
  // or just DB projects if that's what's requested.
  // The user said "ambil data dari proyek yang sudah dibuat oleh owner", 
  // suggesting they want to see the real data.
  const displayProjects = mappedDbProjects.length > 0 ? mappedDbProjects : staticProjects;

  return (
    <section className="max-w-[1440px] mx-auto px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      <div className="flex justify-center mt-20">
        <button className="flex items-center gap-3 group">
          <span className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center group-hover:bg-primary transition-all">
            <Icon name="keyboard_arrow_down" className="group-hover:text-white transition-colors" />
          </span>
          <span className="font-bold text-primary tracking-tight">Lihat Lebih Banyak Proyek</span>
        </button>
      </div>
    </section>
  );
};
