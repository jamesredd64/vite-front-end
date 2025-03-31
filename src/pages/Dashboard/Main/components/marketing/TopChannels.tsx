import { useState } from "react";
import { Dropdown } from "./../../../../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "./../../../../../components/ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../../../../icons";

const TopChannels: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const channels = [
    { name: "Organic Search", visits: "28,345", conversion: "45.2%", trend: "+12.5%" },
    { name: "Direct Traffic", visits: "16,789", conversion: "38.7%", trend: "+5.3%" },
    { name: "Email Marketing", visits: "12,456", conversion: "42.1%", trend: "+8.9%" },
    { name: "Social Media", visits: "10,234", conversion: "35.9%", trend: "+15.2%" },
    { name: "Referral", visits: "8,567", conversion: "33.4%", trend: "+3.7%" },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 sm:px-6 sm:pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Top Marketing Channels
          </h3>
          <div className="relative inline-block">
            <button className="dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
            </button>
            <Dropdown
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              className="w-40 p-2"
            >
              <DropdownItem
                onItemClick={() => setIsOpen(false)}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Export Report
              </DropdownItem>
            </Dropdown>
          </div>
        </div>

        <div className="mt-6">
          <div className="min-w-full overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Channel</th>
                  <th className="pb-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Visits</th>
                  <th className="pb-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Conversion Rate</th>
                  <th className="pb-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Trend</th>
                </tr>
              </thead>
              <tbody>
                {channels.map((channel, index) => (
                  <tr key={index} className="border-b border-gray-200 dark:border-gray-800">
                    <td className="py-4 text-sm font-medium text-gray-800 dark:text-white/90">{channel.name}</td>
                    <td className="py-4 text-right text-sm text-gray-500 dark:text-gray-400">{channel.visits}</td>
                    <td className="py-4 text-right text-sm text-gray-500 dark:text-gray-400">{channel.conversion}</td>
                    <td className="py-4 text-right text-sm text-success-600 dark:text-success-500">{channel.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopChannels;
