import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-32 w-32'
  };

  return (
    <div className="flex justify-center items-center h-full">
      <div className={`animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]} ${className}`}></div>
    </div>
  );
};

export default Loader;