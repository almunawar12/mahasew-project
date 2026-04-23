import React from 'react';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';

export const SearchBar: React.FC = () => {
  return (
    <div className="relative max-w-2xl mt-12 w-full">
      <div className="flex items-center bg-surface-container-lowest p-2 rounded-xl shadow-2xl">
        <span className="material-symbols-outlined text-outline ml-4">search</span>
        <input
          className="w-full bg-transparent border-none focus:ring-0 text-on-surface px-4 py-4 font-medium placeholder:text-outline-variant"
          placeholder="Cari skill, proyek, atau instansi..." type="text" />
        <Button className="px-8 py-4">Cari</Button>
      </div>
      <div className="flex flex-wrap gap-3 mt-6">
        <span className="text-white/60 text-sm font-medium">Populer:</span>
        <a className="text-white/90 text-sm font-medium hover:text-secondary-container underline underline-offset-4 decoration-white/20" href="#">UI Design</a>
        <a className="text-white/90 text-sm font-medium hover:text-secondary-container underline underline-offset-4 decoration-white/20" href="#">React Native</a>
        <a className="text-white/90 text-sm font-medium hover:text-secondary-container underline underline-offset-4 decoration-white/20" href="#">Data Entry</a>
      </div>
    </div>
  );
};
