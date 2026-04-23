import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <a className={`text-2xl font-black tracking-tighter text-primary-container flex items-center gap-1 ${className}`} href="/">
      MahaSewa
    </a>
  );
};
