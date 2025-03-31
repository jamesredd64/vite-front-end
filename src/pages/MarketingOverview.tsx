import { FC } from "react";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import StatsCard from "../components/marketing/StatsCard";
import RevenueChart from "../components/charts/RevenueChart";
import TopChannels from "../components/marketing/TopChannels";
import LeadConversion from "../components/marketing/LeadConversion";
import CampaignPerformance from "../components/marketing/CampaignPerformance";

const MarketingOverview: FC = () => {
  return (
    <>
      <PageMeta
        title="Marketing Overview Dashboard | Your App Name"
        description="Marketing overview dashboard showing key metrics and analytics"
      />
      <PageBreadcrumb pageTitle="Marketing Overview" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Campaigns"
          value="$45.2K"
          growth={4.35}
          isPositive={true}
          icon="campaigns"
          className="rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-white/[0.02]"
        />
        <StatsCard
          title="Lead Conversion"
          value="2,450"
          growth={-2.48}
          isPositive={false}
          icon="leads"
          className="rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-white/[0.02]"
        />
        <StatsCard
          title="Ad Spend"
          value="$12.5K"
          growth={1.48}
          isPositive={true}
          icon="spend"
          className="rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-white/[0.02]"
        />
        <StatsCard
          title="ROI"
          value="325%"
          growth={3.23}
          isPositive={true}
          icon="roi"
          className="rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-white/[0.02]"
        />
      </div>

      {/* Charts Section */}
      <div className="mt-6 grid grid-cols-12 gap-6">
        {/* Revenue Chart */}
        <div className="col-span-12 rounded-2xl bg-white p-6 shadow-sm dark:bg-white/[0.02] xl:col-span-8">
          <RevenueChart title="Marketing Performance" />
        </div>
        
        {/* Top Channels */}
        <div className="col-span-12 rounded-2xl bg-white p-6 shadow-sm dark:bg-white/[0.02] xl:col-span-4">
          <TopChannels />
        </div>

        {/* Lead Conversion */}
        <div className="col-span-12 rounded-2xl bg-white p-6 shadow-sm dark:bg-white/[0.02] xl:col-span-6">
          <LeadConversion />
        </div>

        {/* Campaign Performance */}
        <div className="col-span-12 rounded-2xl bg-white p-6 shadow-sm dark:bg-white/[0.02] xl:col-span-6">
          <CampaignPerformance />
        </div>
      </div>
    </>
  );
};

export default MarketingOverview;
