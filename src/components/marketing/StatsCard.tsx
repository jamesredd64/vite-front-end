import { FC } from "react";
import { PieChartIcon, GroupIcon, DollarLineIcon, ShootingStarIcon } from "../../icons";

interface StatsCardProps {
  title: string;
  value: string;
  growth: number;
  isPositive: boolean;
  icon: "campaigns" | "leads" | "spend" | "roi";
  className?: string;
}

const StatsCard: FC<StatsCardProps> = ({
  title,
  value,
  growth,
  isPositive,
  icon,
  className = "",
}) => {
  const getIcon = () => {
    switch (icon) {
      case "campaigns":
        return <PieChartIcon className="h-6 w-6 text-brand-500 dark:text-brand-400" />;
      case "leads":
        return <GroupIcon className="h-6 w-6 text-brand-500 dark:text-brand-400" />;
      case "spend":
        return <DollarLineIcon className="h-6 w-6 text-brand-500 dark:text-brand-400" />;
      case "roi":
        return <ShootingStarIcon className="h-6 w-6 text-brand-500 dark:text-brand-400" />;
      default:
        return null;
    }
  };

  return (
    <div className={className}>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-500/10">
        {getIcon()}
      </div>

      <div className="mt-4">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </span>
        <div className="mt-2 flex items-baseline justify-between">
          <h4 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {value}
          </h4>
          <span
            className={`flex items-center text-sm font-medium ${
              isPositive
                ? "text-success-600 dark:text-success-500"
                : "text-error-600 dark:text-error-500"
            }`}
          >
            {isPositive ? "+" : ""}
            {growth}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
