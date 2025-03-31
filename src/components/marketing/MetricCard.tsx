import { FC, ReactNode } from 'react';
import Badge from '../ui/badge/Badge';
import { ArrowUpIcon, ArrowDownIcon } from '../../icons';

interface MetricCardProps {
  icon?: ReactNode;
  title: string;
  value: string;
  change?: {
    value: string;
    isPositive: boolean;
    label?: string;
  };
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

const MetricCard: FC<MetricCardProps> = ({
  icon,
  title,
  value,
  change,
  className = '',
  variant = 'default'
}) => {
  const renderIcon = () => {
    if (!icon) return null;
    
    return (
      <div className={`flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 
        ${variant === 'compact' ? 'w-12 h-12' : 'h-[52px] w-[52px] mb-6'}`}>
        <div className="text-gray-800 dark:text-white/90">
          {icon}
        </div>
      </div>
    );
  };

  const renderChange = () => {
    if (!change) return null;

    return (
      <div className="flex items-center gap-1.5">
        <Badge color={change.isPositive ? "success" : "error"}>
          {change.isPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
          {change.value}
        </Badge>
        {change.label && (
          <span className="text-theme-xs text-gray-500 dark:text-gray-400">
            {change.label}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className={`rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 ${className}`}>
      {renderIcon()}
      
      <div className="flex items-end justify-between">
        <div>
          <span className="text-theme-sm text-gray-500 dark:text-gray-400">
            {title}
          </span>
          <h4 className={`font-semibold text-gray-800 dark:text-white/90 
            ${variant === 'compact' ? 'mt-1 text-lg' : 'mt-2 text-2xl'}`}>
            {value}
          </h4>
        </div>
        {renderChange()}
      </div>
    </div>
  );
};

export default MetricCard;