import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useAuth0 } from "@auth0/auth0-react";
import Loader from "../../components/common/Loader";

const { isLoading } = useAuth0();



export default function Users() {

  if (isLoading) {
    return <Loader size="medium" />;
  }
  
  return (
    <>
      <PageMeta
        title="Users Administration | Admin Dashboard"
        description="User administration and management dashboard"
      />
      <PageBreadcrumb pageTitle="Users Administration" />
      
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[800px] text-center">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Welcome To Users Administration
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your users, roles, and permissions from this central dashboard.
          </p>
          
          {/* Add a decorative divider */}
          <div className="my-8 flex items-center justify-center">
            <div className="h-px w-full max-w-[120px] bg-gray-200 dark:bg-gray-700"></div>
            <div className="px-4">
              <svg 
                className="h-8 w-8 text-gray-400 dark:text-gray-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
                />
              </svg>
            </div>
            <div className="h-px w-full max-w-[120px] bg-gray-200 dark:bg-gray-700"></div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
              <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
                Total Users
              </h4>
              <p className="text-3xl font-bold text-brand-500">0</p>
            </div>
            
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
              <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
                Active Users
              </h4>
              <p className="text-3xl font-bold text-green-500">0</p>
            </div>
            
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
              <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
                Pending Invites
              </h4>
              <p className="text-3xl font-bold text-yellow-500">0</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}