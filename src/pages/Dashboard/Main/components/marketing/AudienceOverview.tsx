import { ApexOptions } from "apexcharts";
import { useState } from "react";
import { Dropdown } from "./../../../../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "./../../../../../components/ui/dropdown/DropdownItem";
import { MoreDotIcon } from "./../../../../../icons";

const AudienceOverview: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const options: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "donut",
      height: 335,
    },
    colors: ["#465FFF", "#9CB9FF", "#FFB547", "#FF6B72"],
    labels: ["Desktop", "Mobile", "Tablet", "Others"],
    legend: {
      position: "bottom",
      fontFamily: "Outfit, sans-serif",
      fontSize: "14px",
      markers: {
        size: 8
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
        },
        customScale: 1,
        offsetX: 0,
        offsetY: 0,
        startAngle: 0,
        endAngle: 360,
        expandOnClick: true,
        // borderRadius: 12
      },
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const series = [45, 30, 15, 10];
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Audience Overview
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Device usage distribution
          </p>
        </div>
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
              View Details
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

export default AudienceOverview;


