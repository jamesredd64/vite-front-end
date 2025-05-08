import PageMeta from "../../components/common/PageMeta";
import MarketingMetrics from "../../components/marketing/MarketingMetrics";
import CampaignPerformance from "../../components/marketing/CampaignPerformance";
import SocialMediaStats from "../../components/marketing/SocialMediaStats";
import LeadConversion from "../../components/marketing/LeadConversion";
import TopChannels from "../../components/marketing/TopChannels";
import AudienceOverview from "../../components/marketing/AudienceOverview";
import { FC } from "react";
// import StatsCard from "../../components/marketing/StatsCard";
// import { getImageUrl } from '../../config/images.config';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useAuth0 } from "@auth0/auth0-react";
import Loader from "../../components/common/Loader";




const Marketing: FC = () => {
  const { isLoading } = useAuth0();
  if (isLoading) {
    return <Loader size="medium" />;
  }

  return (
    <>
      <PageMeta
        title="React.js Marketing Dashboard | Admin Dashboard Template"
        description="This is React.js Marketing Dashboard page Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Ecommerce" />
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
