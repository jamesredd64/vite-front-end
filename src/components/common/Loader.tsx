import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-16 w-16',
    large: 'h-32 w-32'
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-4">
        <div 
          className={`
            animate-spin 
            rounded-full 
            border-4 
            border-brand-400 
            border-t-transparent 
            border-b-transparent 
            shadow-lg 
            ${sizeClasses[size]} 
            ${className}
          `}
        />
        <span className="text-brand-500 dark:text-brand-400 font-semibold animate-pulse">
          Loading...
        </span>
      </div>
    </div>
  );
};

export default Loader;
