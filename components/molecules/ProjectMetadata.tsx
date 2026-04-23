import React from 'react';
import { Badge } from '../atoms/Badge';

interface ProjectMetadataProps {
  budget: string;
  deadline: string;
  skills: string[];
  isGrid?: boolean;
}

export const ProjectMetadata: React.FC<ProjectMetadataProps> = ({ 
  budget, 
  deadline, 
  skills, 
  isGrid = false 
}) => {
  if (isGrid) {
    return (
      <div className="mt-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <p className="text-[10px] uppercase font-bold tracking-widest text-outline mb-1">Budget</p>
          <p className="font-bold text-primary">{budget}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold tracking-widest text-outline mb-1">Deadline</p>
          <p className="font-bold text-primary">{deadline}</p>
        </div>
        <div className="col-span-2">
          <p className="text-[10px] uppercase font-bold tracking-widest text-outline mb-1">Skills</p>
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <Badge key={skill} variant="skill">{skill}</Badge>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-auto">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] uppercase font-bold tracking-widest text-outline mb-1">Budget</p>
          <p className="font-bold text-primary">{budget}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold tracking-widest text-outline mb-1 text-right">Deadline</p>
          <p className="font-bold text-primary text-right">{deadline}</p>
        </div>
      </div>
      <div className="pt-4 border-t border-outline-variant/20">
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <Badge key={skill} variant="skill">{skill}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
