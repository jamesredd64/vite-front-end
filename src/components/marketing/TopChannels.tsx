import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import GridIcon from "../../icons/grid.svg?react";
import UserIcon from "../../icons/user-line.svg?react";
import MailIcon from "../../icons/mail-line.svg?react";
import ChatIcon from "../../icons/chat.svg?react";
import BoxCubeIcon from "../../icons/box-cube.svg?react";
import MoreDotIcon from "../../icons/moredot.svg?react";

const TopChannels: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const channels = [
    { 
      name: "Organic Search", 
      visits: "28,345", 
      conversion: "45.2%", 
      trend: "+12.5%",
      icon: <GridIcon className="size-5 text-blue-500" />
    },
    { 
      name: "Direct Traffic", 
      visits: "16,789", 
      conversion: "38.7%", 
      trend: "+5.3%",
      icon: <BoxCubeIcon className="size-5 text-purple-500" />
    },
    { 
      name: "Email Marketing", 
      visits: "12,456", 
      conversion: "42.1%", 
      trend: "+8.9%",
      icon: <MailIcon className="size-5 text-green-500" />
    },
    { 
      name: "Social Media", 
      visits: "10,234", 
      conversion: "35.9%", 
      trend: "+15.2%",
      icon: <ChatIcon className="size-5 text-orange-500" />
    },
    { 
      name: "Referral", 
      visits: "8,567", 
      conversion: "33.4%", 
      trend: "+3.7%",
      icon: <UserIcon className="size-5 text-red-500" />
    },
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
                    <td className="py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800">
                          {channel.icon}
                        </div>
                        {channel.name}
                      </div>
                    </td>
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




