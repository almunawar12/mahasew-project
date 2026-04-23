import React from 'react';
import { SearchBar } from '../molecules/SearchBar';
import { Icon } from '../atoms/Icon';

export const HeroSection: React.FC = () => {
  return (
    <section className="asymmetric-hero relative overflow-hidden py-24 px-8 lg:px-24">
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
        <img 
          alt="Students collaborating" 
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-BILzuOJqrQ7QZtRkY0rlZhxDlqTl-JvuzN97CuepR_pxU7yKWiqsbJTSTkEYDiOYFm-erWIwoYALKlnvYg6vL77Jm1MtGVGtyBd0pnmz953lmMMmyT4jt3q293W1hr9gMj07Prk8cMGJoa004eFs3K7BT_sKq6vtP0ptOucd8omlEEuOzNSu1g8-A3aXo6TPwOacddvHAiuJ6BOMgTJkCdZkj5fbcWJBzcIk5PXm7bYWenGfQjQ-wlxgeto-GE-1bU03Zgd9-frS" 
        />
      </div>
      <div className="relative z-10 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container/10 text-secondary-container rounded-full mb-6">
          <Icon name="auto_awesome" className="text-sm" fill />
          <span className="text-[10px] font-bold tracking-widest uppercase">Trusted by 500+ Companies</span>
        </div>
        <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-8">
          Temukan Proyek <br />
          <span className="text-secondary-container">Sampingan</span> Pertama Kamu.
        </h1>
        <SearchBar />
      </div>
    </section>
  );
};
