import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
// import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useAuth0 } from "@auth0/auth0-react";
import Loader from "../../components/common/Loader";




export default function Home() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <Loader size="medium" />;
  }

  
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page - Admin Dashboard Template"
      />
       <PageBreadcrumb pageTitle="Ecommerce" />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />
          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
