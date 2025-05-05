/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";

import { ArrowDownIcon, ArrowUpIcon, UserIcon, BoltIcon, PieChartIcon, GroupIcon } from '../icons';
import Badge from '../components/ui/badge/Badge';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useAuth0 } from "@auth0/auth0-react";

const AdminDashboard: React.FC = () => {
  // Sample data for the area chart
  const { isLoading } = useAuth0();
  const areaChartOptions: ApexOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    colors: ['#4F46E5', '#10B981'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
    }
  };

  const areaChartSeries = [
    {
      name: 'Active Users',
      data: [31, 40, 28, 51, 42, 109, 100, 120, 80]
    },
    {
      name: 'New Signups',
      data: [11, 32, 45, 32, 34, 52, 41, 80, 96]
    }
  ];

  
  if (isLoading) {
    return 'Loading Admin Dashboard';
  }

  return (
    <>
      <PageMeta 
        title="Admin Dashboard | TailAdmin"
        description="Admin dashboard showing key metrics and management options" 
      />
      <PageBreadcrumb pageTitle="Admin Dashboard" />
      
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Quick Stats Row */}
        <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Total Users */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl dark:bg-indigo-900/30">
              <UserIcon className="text-indigo-600 size-6 dark:text-indigo-400" />
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Total Users
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  24,561
                </h4>
              </div>
              <Badge color="success">
                <ArrowUpIcon />
                12.5%
              </Badge>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl dark:bg-green-900/30">
              <BoltIcon className="text-green-600 size-6 dark:text-green-400" />
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Active Sessions
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  1,482
                </h4>
              </div>
              <Badge color="success">
                <ArrowUpIcon />
                8.2%
              </Badge>
            </div>
          </div>

          {/* System Load */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl dark:bg-yellow-900/30">
              <PieChartIcon className="text-yellow-600 size-6 dark:text-yellow-400" />
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  System Load
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  42%
                </h4>
              </div>
              <Badge color="warning">
                <ArrowUpIcon />
                3.1%
              </Badge>
            </div>
          </div>

          {/* Error Rate */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl dark:bg-red-900/30">
              <GroupIcon className="text-red-600 size-6 dark:text-red-400" />
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Error Rate
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  0.12%
                </h4>
              </div>
              <Badge color="error">
                <ArrowDownIcon />
                2.3%
              </Badge>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="col-span-12 xl:col-span-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  User Activity Overview
                </h3>
                <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                  Monthly active users and new signups
                </p>
              </div>
            </div>
            <div className="h-[350px]">
              <Chart 
                options={areaChartOptions}
                series={areaChartSeries}
                type="area"
                height="100%"
              />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-span-12 xl:col-span-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {/* Activity Items */}
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-start gap-4 border-b border-gray-100 pb-4 dark:border-gray-800">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center dark:bg-indigo-900/30">
                    <UserIcon className="size-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 dark:text-white/90">
                      New user registration
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      2 minutes ago
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
