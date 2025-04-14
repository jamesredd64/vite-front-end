import React from 'react';

interface DropdownItemProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  as?: 'button' | 'div';
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  className = '',
  onClick,
  as = 'div'  // default to div instead of button
}) => {
  const Component = as;
  
  return (
    <Component
      className={`w-full text-left hover:bg-gray-50 dark:hover:bg-gray-800 ${className}`}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};
