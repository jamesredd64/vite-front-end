import { FC } from 'react';
import PageMeta from '../../../components/common/PageMeta';

import MarketingMetrics from './components/marketing/MarketingMetrics';
import CampaignPerformance from './components/marketing/CampaignPerformance';
import SocialMediaStats from './components/marketing/SocialMediaStats';
import LeadConversion from './components/marketing/LeadConversion';
import TopChannels from './components/marketing/TopChannels';
import AudienceOverview from './components/marketing/AudienceOverview';

const Marketing: FC = () => {
  return (
    <>
      <PageMeta
        title="React.js Marketing Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Marketing Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <MarketingMetrics />
          <CampaignPerformance />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <LeadConversion />
        </div>

        <div className="col-span-12">
          <SocialMediaStats />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <AudienceOverview />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <TopChannels />
        </div>
      </div>
    </>
  );
};

export default Marketing;

