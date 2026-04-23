import React from 'react';
import { Badge } from '../atoms/Badge';
import { Icon } from '../atoms/Icon';
import { Button } from '../atoms/Button';
import { ProjectMetadata } from '../molecules/ProjectMetadata';
import { Project } from '../../lib/data';
import Link from 'next/link';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  if (project.variant === 'featured') {
    return (
      <div className="lg:col-span-2 bg-surface-container-low rounded-xl p-8 hover:bg-surface-container-high transition-all group relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8">
          <Badge variant="premium">Premium Project</Badge>
        </div>
        <div className="flex flex-col h-full">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <img src={project.clientLogo} alt={project.clientName} className="w-12 h-12 rounded-lg object-contain bg-white p-2" />
              <div>
                <h4 className="font-bold text-primary leading-tight">{project.clientName}</h4>
                <p className="text-xs text-on-surface-variant">{project.clientAffiliation}</p>
              </div>
            </div>
            <h3 className="font-headline text-3xl font-extrabold text-primary-container group-hover:text-secondary-container transition-colors duration-300">
              {project.title}
            </h3>
          </div>
          <ProjectMetadata 
            budget={project.budget} 
            deadline={project.deadline} 
            skills={project.skills} 
            isGrid 
          />
          <div className="mt-8">
            <Link href={`/proyek/${project.id}`}>
              <Button variant="primary">Lamar Proyek</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (project.variant === 'flash') {
    return (
      <div className="bg-primary-container rounded-xl p-8 hover:brightness-110 transition-all group relative">
        <div className="flex flex-col h-full text-white">
          <div className="mb-6">
            <Badge variant="flash">Flash Project</Badge>
            <h3 className="font-headline text-2xl font-extrabold leading-tight mt-4">{project.title}</h3>
          </div>
          <p className="text-on-primary-container text-sm line-clamp-2 mb-6">{project.description}</p>
          <div className="mt-auto space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-xl font-black text-secondary-container">{project.budget} <span className="text-xs font-normal text-white/60">/ artikel</span></p>
              <Icon name="bolt" className="text-secondary-container" />
            </div>
            <Link href={`/proyek/${project.id}`} className="w-full">
              <Button variant="on-primary" className="w-full">Lamar Cepat</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-low rounded-xl p-8 hover:bg-surface-container-high transition-all group border border-transparent hover:border-secondary-container/20">
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <img src={project.clientLogo} alt={project.clientName} className="w-10 h-10 rounded-lg object-contain bg-white p-2" />
            <div>
              <h4 className="font-bold text-primary text-sm">{project.clientName}</h4>
              <p className="text-[10px] text-on-surface-variant">{project.clientAffiliation}</p>
            </div>
          </div>
          <h3 className="font-headline text-xl font-bold text-primary-container leading-snug">{project.title}</h3>
        </div>
        <ProjectMetadata budget={project.budget} deadline={project.deadline} skills={project.skills} />
        <div className="mt-8">
          <Link href={`/proyek/${project.id}`} className="w-full">
            <Button variant="primary" className="w-full">Lamar Proyek</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
