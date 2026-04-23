import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  verified?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  size = 'md', 
  className = '', 
  verified = false 
}) => {
  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className={`relative ${className}`}>
      <img 
        src={src} 
        alt={alt} 
        className={`${sizes[size]} rounded-full object-cover border-2 border-surface-container-highest`} 
      />
      {verified && (
        <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-0.5 flex items-center justify-center border-2 border-surface">
          <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            verified
          </span>
        </div>
      )}
    </div>
  );
};
