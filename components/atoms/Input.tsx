import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({ icon, className = '', ...props }) => {
  return (
    <div className={`flex items-center bg-surface-container-lowest p-2 rounded-xl shadow-2xl ${className}`}>
      {icon && (
        <span className="material-symbols-outlined text-outline ml-4">
          {icon}
        </span>
      )}
      <input
        className="w-full bg-transparent border-none focus:ring-0 text-on-surface px-4 py-4 font-medium placeholder:text-outline-variant"
        {...props}
      />
    </div>
  );
};
