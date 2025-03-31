import React from 'react';
import PageMeta from '../../components/common/PageMeta';

const Contact: React.FC = () => {
  return (
    <>
      <PageMeta title="Contact Us" />
      <div className="p-4 md:p-6 2xl:p-10">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Contact Us</h1>
          <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 2xl:p-10">
            <form className="space-y-4">
              <div>
                <label className="mb-2.5 block font-medium text-black dark:text-white">Name</label>
                <input type="text" placeholder="Enter your name" className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary" />
              </div>
              <div>
                <label className="mb-2.5 block font-medium text-black dark:text-white">Email</label>
                <input type="email" placeholder="Enter your email" className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary" />
              </div>
              <div>
                <label className="mb-2.5 block font-medium text-black dark:text-white">Message</label>
                <textarea placeholder="Your message" rows={4} className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"></textarea>
              </div>
              <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray-100 hover:bg-opacity-90">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;