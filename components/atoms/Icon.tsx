import React from 'react';

interface IconProps {
  name: string;
  className?: string;
  fill?: boolean;
  onClick?: () => void;
}

export const Icon: React.FC<IconProps> = ({ name, className = '', fill = false, onClick }) => {
  return (
    <span 
      className={`material-symbols-outlined ${className}`}
      style={{ fontVariationSettings: `'FILL' ${fill ? 1 : 0}` }}
      onClick={onClick}
    >
      {name}
    </span>
  );
};
