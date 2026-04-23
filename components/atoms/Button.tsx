import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'on-primary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles =
    'rounded-lg font-bold transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2';

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-8 py-4',
    lg: 'px-10 py-5 text-lg',
  };

  const variants = {
    primary:
      'bg-secondary-container text-white hover:brightness-110 shadow-secondary-container/20',
    secondary:
      'bg-primary-container text-white hover:brightness-110 shadow-black/20',
    ghost:
      'p-2 text-on-surface-variant hover:text-primary active:scale-95 shadow-none px-4 py-2',
    'on-primary':
      'bg-secondary-container text-white hover:brightness-110 shadow-black/20',
  };

  return (
    <button
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
