import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'premium' | 'skill' | 'flash' | 'status';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'skill', className = '' }) => {
  const baseStyles = 'text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full';
  
  const variants = {
    premium: 'bg-secondary-container/10 text-secondary font-black tracking-tighter',
    skill: 'bg-surface-container-highest text-on-surface-variant',
    flash: 'bg-white/10 text-white/90',
    status: 'bg-secondary-container/10 text-secondary uppercase tracking-widest',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
