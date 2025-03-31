import { FC } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import ChartTab from '../common/ChartTab';

interface RevenueChartProps {
  title?: string;
}

const RevenueChart: FC<RevenueChartProps> = ({ title = "Revenue Growth" }) => {
  const options: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "area",
      height: 335,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: ["#465FFF", "#9CB9FF"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [2, 2],
      curve: 'smooth',
    },
    grid: {
      show: true,
      borderColor: '#E5E7EB',
      strokeDashArray: 4,
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    legend: {
      show: false,
    },
    markers: {
      size: 4,
      colors: ["#465FFF", "#9CB9FF"],
      strokeColors: "#FFFFFF",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          fontSize: '12px',
          colors: '#6B7280',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          colors: ['#6B7280'],
        },
        formatter: (value) => `$${value}K`,
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
    tooltip: {
      y: {
        formatter: (value) => `$${value}K`,
      },
    },
  };

  const series = [
    {
      name: 'Revenue',
      data: [28, 45, 35, 50, 32, 55, 23, 60, 28, 45, 35, 48],
    },
    {
      name: 'Profit',
      data: [14, 25, 20, 25, 18, 30, 15, 25, 14, 20, 15, 20],
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monthly revenue and profit overview
          </p>
        </div>
        <ChartTab />
      </div>

      <div className="mt-4 h-[330px]">
        <Chart
          options={options}
          series={series}
          type="area"
          height="100%"
          width="100%"
        />
      </div>
    </div>
  );
};

export default RevenueChart;