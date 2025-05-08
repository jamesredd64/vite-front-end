import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import { useAuth0 } from "@auth0/auth0-react";
import Loader from "../../components/common/Loader";

export default function CustomerDemographics() {

  const { isLoading } = useAuth0();

  if (isLoading) {
    return <Loader size="medium" />;
  }

  return (
    <>
      <PageMeta
        title="US Attendee Demographics | Event Management Dashboard"
        description="Analysis of attendee demographics and behavior across United States"
      />
      <PageBreadcrumb pageTitle="US Attendee Demographics" />
      
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Summary Cards */}
        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h4 className="mb-3 font-medium text-gray-800 dark:text-white/90">Total US Attendees</h4>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-gray-800 dark:text-white/90">4,158</span>
              <span className="text-sm text-green-500">+15.2%</span>
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h4 className="mb-3 font-medium text-gray-800 dark:text-white/90">States Covered</h4>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-gray-800 dark:text-white/90">42</span>
              <span className="text-sm text-green-500">+3 new</span>
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h4 className="mb-3 font-medium text-gray-800 dark:text-white/90">Avg. Events/State</h4>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-gray-800 dark:text-white/90">24</span>
              <span className="text-sm text-green-500">+8.4%</span>
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h4 className="mb-3 font-medium text-gray-800 dark:text-white/90">Active Regions</h4>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-gray-800 dark:text-white/90">5</span>
              <span className="text-sm text-green-500">+1 new</span>
            </div>
          </div>
        </div>

        {/* Main Demographics Card */}
        <div className="col-span-12">
          <DemographicCard />
        </div>
      </div>
    </>
  );
}
