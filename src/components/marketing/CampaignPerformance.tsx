import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ChartTab from "../common/ChartTab";

const CampaignPerformance: React.FC = () => {
  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 450, // Increased height
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: [2, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
      title: {
        text: "",
      },
    },
  };

  const series = [
    {
      name: "Email Campaigns",
      data: [45, 52, 38, 45, 19, 23, 25, 35, 40, 45, 48, 43],
    },
    {
      name: "Social Campaigns",
      data: [30, 25, 35, 30, 22, 20, 28, 38, 42, 47, 50, 48],
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 h-full flex flex-col"> {/* Added h-full and flex flex-col */}
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Campaign Performance
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Monthly campaign effectiveness metrics
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar flex-1"> {/* Added flex-1 */}
        <div className="min-w-[1000px] xl:min-w-full h-full"> {/* Added h-full */}
          <Chart 
            options={options} 
            series={series} 
            type="area" 
            height="450" // Increased height to match container
          />
        </div>
      </div>
    </div>
  );
}

export default CampaignPerformance;

