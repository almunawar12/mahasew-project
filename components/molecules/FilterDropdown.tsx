import React from 'react';
import { Icon } from '../atoms/Icon';

interface FilterDropdownProps {
  label: string;
  options: string[];
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, options }) => {
  return (
    <div className="relative group">
      <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">
        {label}
      </label>
      <select className="appearance-none bg-surface-container-high ghost-border px-6 py-3 pr-12 rounded-lg text-on-surface font-semibold focus:bg-surface-container-lowest transition-all focus:ring-2 focus:ring-primary/10 outline-none">
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <Icon name="expand_more" className="absolute right-4 bottom-3.5 pointer-events-none text-outline text-sm" />
    </div>
  );
};
