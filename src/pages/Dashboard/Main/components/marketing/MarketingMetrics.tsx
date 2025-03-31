import { ArrowDownIcon, ArrowUpIcon, UserIcon, BoltIcon } from "../../../../../icons";
import Badge from "./../../../../../components/ui/badge/Badge";

export default function MarketingMetrics() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Metric Item Start */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <UserIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              New Leads
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              2,546
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            15.25%
          </Badge>
        </div>
      </div>
      {/* Metric Item End */}

      {/* Metric Item Start */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoltIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Campaigns
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              18
            </h4>
          </div>

          <Badge color="error">
            <ArrowDownIcon />
            5.23%
          </Badge>
        </div>
      </div>
      {/* Metric Item End */}
    </div>
  );
}

