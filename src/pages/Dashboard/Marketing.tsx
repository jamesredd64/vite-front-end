import PageMeta from "../../components/common/PageMeta";
import MarketingMetrics from "../../components/marketing/MarketingMetrics";
import CampaignPerformance from "../../components/marketing/CampaignPerformance";
import SocialMediaStats from "../../components/marketing/SocialMediaStats";
import LeadConversion from "../../components/marketing/LeadConversion";
import TopChannels from "../../components/marketing/TopChannels";
import AudienceOverview from "../../components/marketing/AudienceOverview";
import { getImageUrl } from '../../config/images.config';

export default function Marketing() {
  return (
    <>
      <PageMeta
        title="React.js Marketing Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Marketing Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 xl:col-span-7 flex flex-col gap-6">
          <MarketingMetrics />
          <div className="flex-1">
            <CampaignPerformance />
          </div>
        </div>

        <div className="col-span-12 xl:col-span-5 flex flex-col gap-6">
          <LeadConversion />
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] flex-1">
            <div className="p-6 h-full flex flex-col">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Marketing Goals
              </h3>
              <div className="mt-4 flex-1 flex flex-col justify-center">
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="flex flex-col">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Monthly Leads Target</span>
                      <span className="font-semibold text-xl text-gray-800 dark:text-white/90">3,000</span>
                    </div>
                    <span className="text-success-600 dark:text-success-500 text-sm">+12.5%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="flex flex-col">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Conversion Goal</span>
                      <span className="font-semibold text-xl text-gray-800 dark:text-white/90">75%</span>
                    </div>
                    <span className="text-success-600 dark:text-success-500 text-sm">+5.3%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="flex flex-col">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">ROI Target</span>
                      <span className="font-semibold text-xl text-gray-800 dark:text-white/90">250%</span>
                    </div>
                    <span className="text-success-600 dark:text-success-500 text-sm">+8.9%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
}



