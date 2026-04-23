import React from 'react';
import { FilterDropdown } from '../molecules/FilterDropdown';

export const FilterBar: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
      <div className="flex flex-wrap gap-4">
        <FilterDropdown label="Kategori" options={["Web Development", "Mobile Apps", "Data Science"]} />
        <FilterDropdown label="Budget" options={["Semua Budget", "Dibawah Rp 1jt", "Rp 1jt - Rp 5jt", "Diatas Rp 5jt"]} />
        <FilterDropdown label="Skill" options={["JavaScript", "Python", "Figma", "Writing"]} />
      </div>
      <div className="text-right">
        <p className="text-on-surface-variant text-sm font-medium">
          Menampilkan <span className="text-primary font-bold">124 Proyek</span> Tersedia
        </p>
      </div>
    </div>
  );
};
