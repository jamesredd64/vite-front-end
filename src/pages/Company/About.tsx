import React from 'react';
import PageMeta from '../../components/common/PageMeta';

const About: React.FC = () => {
  return (
    <>
      <PageMeta title="About Us" />
      <div className="p-4 md:p-6 2xl:p-10">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-6 text-4xl font-extrabold text-gray-900 dark:text-white">About Us</h1>
          
          {/* Vision Section */}
          <div className="mb-8 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 2xl:p-10">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Our Vision</h2>
            <p className="text-gray-800 dark:text-gray-200 text-lg font-medium mb-6">
              We envision a future where businesses of all sizes have access to enterprise-grade tools that drive growth, 
              efficiency, and innovation. Our platform is designed to transform complex business operations into 
              intuitive, manageable processes.
            </p>
          </div>

          {/* Mission & Values Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 2xl:p-10">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                To empower organizations with innovative solutions that drive growth and success through streamlined 
                operations and data-driven insights, making complex business processes simple and efficient.
              </p>
            </div>

            <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 2xl:p-10">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Core Values</h2>
              <ul className="space-y-3 text-gray-800 dark:text-gray-200 font-medium">
                <li className="flex items-center">
                  <span className="mr-2 text-brand-500 text-lg">•</span>
                  Innovation & Excellence
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-brand-500 text-lg">•</span>
                  Customer Success
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-brand-500 text-lg">•</span>
                  Transparency & Trust
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-brand-500 text-lg">•</span>
                  Continuous Improvement
                </li>
              </ul>
            </div>
          </div>

          {/* Features Section */}
          <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 2xl:p-10">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">Modern Technology</h3>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                    Built with cutting-edge technologies to ensure scalability, security, and performance.
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">Data-Driven Insights</h3>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                    Advanced analytics and reporting tools to make informed business decisions.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">24/7 Support</h3>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                    Dedicated support team available around the clock to assist you.
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">Enterprise Security</h3>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                    Bank-grade security measures to protect your sensitive business data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;

