import { ApexOptions } from "apexcharts";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import ReactApexChart from "react-apexcharts";

const AudienceOverview: React.FC = () => {
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
      },
    },
  };

  const series = [45, 30, 15, 10];
  const [isOpen, setIsOpen] = useState(false);

  const metrics = [
    { label: "Desktop Users", value: "45%", change: "+2.5%", isPositive: true },
    { label: "Mobile Users", value: "30%", change: "+4.3%", isPositive: true },
    { label: "Tablet Users", value: "15%", change: "-1.2%", isPositive: false },
    { label: "Other Devices", value: "10%", change: "-0.8%", isPositive: false },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] h-full flex flex-col">
      <div className="p-5 sm:p-6 flex-1 flex flex-col">
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

        <div className="mt-6 flex-1 flex flex-col">
          <div className="flex-1">
            <ReactApexChart
              options={options}
              series={series}
              type="donut"
              height="100%"
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            {metrics.map((metric, index) => (
              <div key={index} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {metric.label}
                </p>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-xl font-semibold text-gray-800 dark:text-white/90">
                    {metric.value}
                  </span>
                  <span className={`text-sm ${metric.isPositive ? 'text-success-600 dark:text-success-500' : 'text-error-600 dark:text-error-500'}`}>
                    {metric.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AudienceOverview;

