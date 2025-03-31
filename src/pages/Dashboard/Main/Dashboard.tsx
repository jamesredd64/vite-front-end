import { FC } from 'react';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';

// Import your component cards here
import MarketingMetrics from './components/marketing/MarketingMetrics';
import CampaignPerformance from './components/marketing/CampaignPerformance';
import SocialMediaStats from './components/marketing/SocialMediaStats';
import LeadConversion from './components/marketing/LeadConversion';
import TopChannels from './components/marketing/TopChannels';
import AudienceOverview from './components/marketing/AudienceOverview';

const Dashboard: FC = () => {
  return (
    <>
      <PageMeta
        title="Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Dashboard" />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Left Column */}
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <MarketingMetrics />
          <CampaignPerformance />
        </div>

        {/* Right Column */}
        <div className="col-span-12 xl:col-span-5">
          <LeadConversion />
        </div>

        {/* Full Width Section */}
        <div className="col-span-12">
          <SocialMediaStats />
        </div>

        {/* Bottom Left Section */}
        <div className="col-span-12 xl:col-span-5">
          <AudienceOverview />
        </div>

        {/* Bottom Right Section */}
        <div className="col-span-12 xl:col-span-7">
          <TopChannels />
        </div>
      </div>
    </>
  );
};

export default Dashboard;