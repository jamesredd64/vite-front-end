import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserProfileStore } from '../../stores/userProfileStore';
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import  UserMetadata  from "../../types/user.js";

interface MarketingBudget {
  frequency: "daily" | "monthly" | "quarterly" | "yearly";
  adBudget: number;
  costPerAcquisition: number;
  dailySpendingLimit: number;
  marketingChannels: string;
  monthlyBudget: number;
  preferredPlatforms: string;
  notificationPreferences: string[];
  roiTarget: number;
}

interface UserMarketingCardProps {
  onUpdate: (newInfo: Partial<UserMetadata>) => void;
  initialData: {
    marketingBudget: MarketingBudget;
  };
}

export const UserMarketingCard: React.FC<UserMarketingCardProps> = ({ onUpdate, initialData }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const { user } = useAuth0();
  const userProfile = useUserProfileStore();
  
  // Initialize formData with initialData, ensuring all fields are properly typed
  const [formData, setFormData] = useState({
    marketingBudget: {
      frequency: initialData.marketingBudget.frequency || "monthly",
      adBudget: Number(initialData.marketingBudget.adBudget) || 0,
      costPerAcquisition: Number(initialData.marketingBudget.costPerAcquisition) || 0,
      dailySpendingLimit: Number(initialData.marketingBudget.dailySpendingLimit) || 0,
      marketingChannels: initialData.marketingBudget.marketingChannels || "",
      monthlyBudget: Number(initialData.marketingBudget.monthlyBudget) || 0,
      preferredPlatforms: initialData.marketingBudget.preferredPlatforms || "",
      notificationPreferences: Array.isArray(initialData.marketingBudget.notificationPreferences) 
        ? initialData.marketingBudget.notificationPreferences 
        : [],
      roiTarget: Number(initialData.marketingBudget.roiTarget) || 0
    }
  });

  // Update formData when initialData changes
  useEffect(() => {
    const newFormData = {
      marketingBudget: {
        frequency: initialData.marketingBudget.frequency || "monthly",
        adBudget: Number(initialData.marketingBudget.adBudget) || 0,
        costPerAcquisition: Number(initialData.marketingBudget.costPerAcquisition) || 0,
        dailySpendingLimit: Number(initialData.marketingBudget.dailySpendingLimit) || 0,
        marketingChannels: initialData.marketingBudget.marketingChannels || "",
        monthlyBudget: Number(initialData.marketingBudget.monthlyBudget) || 0,
        preferredPlatforms: initialData.marketingBudget.preferredPlatforms || "",
        notificationPreferences: Array.isArray(initialData.marketingBudget.notificationPreferences)
          ? initialData.marketingBudget.notificationPreferences
          : [],
        roiTarget: Number(initialData.marketingBudget.roiTarget) || 0
      }
    };

    // Only update if the data has actually changed
    if (JSON.stringify(formData) !== JSON.stringify(newFormData)) {
      setFormData(newFormData);
    }
  }, [initialData]); // Remove formData from dependencies

  const handleInputChange = (field: keyof MarketingBudget) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({
      marketingBudget: {
        ...prev.marketingBudget,
        [field]: 
          // Handle string array for notification preferences
          field === 'notificationPreferences' ? 
            (typeof value === 'string' ? value.split(',').map(v => v.trim()).filter(Boolean) : []) :
          // Handle string fields
          field === 'marketingChannels' || field === 'preferredPlatforms' ? 
            value :
          // Handle frequency enum
          field === 'frequency' ? 
            value :
          // Handle numeric fields with proper conversion
          field === 'adBudget' || 
          field === 'costPerAcquisition' || 
          field === 'dailySpendingLimit' || 
          field === 'monthlyBudget' || 
          field === 'roiTarget' ? 
            Number(value) || 0 :
          // Default fallback
          value
      }
    }));
    
    userProfile.setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    try {
      if (!user?.sub) return;
      console.log('Saving marketing budget:', formData.marketingBudget);
      onUpdate({
        marketingBudget: {
          ...formData.marketingBudget
        }
      });
      closeModal();
    } catch (error) {
      console.error('Error saving marketing info:', error);
    }
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 group hover:bg-gray-50 dark:hover:bg-gray-800/50 bottom-40">
      <div className="flex flex-col gap-4"> {/* Added flex container */}
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <h3 className="font-medium text-black dark:text-white">
            Marketing Information
          </h3>
        </div>
         {/* changed from 2 to 3 cols below [md:grid-cols-3] */}
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6"> {/* Changed from grid-cols-4 to grid-cols-5 */}
          {/* First Column */}
          <div className="space-y-4">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Ad Budget</span>
              <p className="text-gray-600 dark:text-gray-400">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(formData.marketingBudget.adBudget)}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Cost Per Acquisition</span>
              <p className="text-gray-600 dark:text-gray-400">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(formData.marketingBudget.costPerAcquisition)}
              </p>
            </div>
          </div>

          {/* Second Column */}
          <div className="space-y-4">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Marketing Channels</span>
              <p className="text-gray-600 dark:text-gray-400">
                {formData.marketingBudget.marketingChannels || 'Not set'}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Monthly Budget</span>
              <p className="text-gray-600 dark:text-gray-400">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(formData.marketingBudget.monthlyBudget)}
              </p>
            </div>
          </div>

          {/* Third Column */}
          <div className="space-y-4">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Notification Preferences</span>
              <p className="text-gray-600 dark:text-gray-400">
                {formData.marketingBudget.notificationPreferences.join(', ') || 'Not set'}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">ROI Target</span>
              <p className="text-gray-600 dark:text-gray-400">
                {new Intl.NumberFormat('en-US', { style: 'percent' }).format(formData.marketingBudget.roiTarget / 100)}
              </p>
            </div>
          </div>

          {/* Fourth Column - Frequency */}
          <div className="space-y-4">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Frequency</span>
              <p className="text-gray-600 dark:text-gray-400 capitalize">
                {formData.marketingBudget.frequency}
              </p>
            </div>
          </div>

          {/* Fifth Column - Edit Button */}
          <div className="flex items-center justify-end">
            <button 
              onClick={openModal}
              className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 min-w-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <svg
                className="fill-current"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206Z"
                  fill=""
                />
              </svg>
              Edit
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="!w-[33vw]">
        <div className="p-6 bg-white rounded-lg dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4">Edit Marketing Information</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>Ad Budget</Label>
                <Input
                  type="number"
                  value={formData.marketingBudget.adBudget}
                  onChange={handleInputChange('adBudget')}
                  step={0.01}
                  min="0"
                  placeholder="0.00"
                  className="pl-7"
                  prefix="$"
                  isCurrency={true}
                />
              </div>
              <div>
                <Label>Cost Per Acquisition</Label>
                <Input
                  type="number"
                  value={formData.marketingBudget.costPerAcquisition}
                  onChange={handleInputChange('costPerAcquisition')}
                  step={0.01}
                  min="0"
                  placeholder="0.00"
                  className="pl-7"
                  prefix="$"
                  isCurrency={true}
                />
              </div>
              <div>
                <Label>Daily Spending Limit</Label>
                <Input
                  type="number"
                  value={formData.marketingBudget.dailySpendingLimit}
                  onChange={handleInputChange('dailySpendingLimit')}
                  step={0.01}
                  min="0"
                  placeholder="0.00"
                  className="pl-7"
                  prefix="$"
                  isCurrency={true}
                />
              </div>
              <div>
                <Label>Monthly Budget</Label>
                <Input
                  type="number"
                  value={formData.marketingBudget.monthlyBudget}
                  onChange={handleInputChange('monthlyBudget')}
                  step={0.01}
                  min="0"
                  placeholder="0.00"
                  className="pl-7"
                  prefix="$"
                  isCurrency={true}
                />
              </div>
              <div>
                <Label>Marketing Channels</Label>
                <Input
                  type="text"
                  value={formData.marketingBudget.marketingChannels}
                  onChange={handleInputChange('marketingChannels')}
                  placeholder="Enter marketing channels"
                />
              </div>
              <div>
                <Label>Preferred Platforms</Label>
                <Input
                  type="text"
                  value={formData.marketingBudget.preferredPlatforms}
                  onChange={handleInputChange('preferredPlatforms')}
                  placeholder="Enter preferred platforms"
                />
              </div>
              <div>
                <Label>Notification Preferences</Label>
                <Input
                  type="text"
                  value={formData.marketingBudget.notificationPreferences.join(',')}
                  onChange={handleInputChange('notificationPreferences')}
                  placeholder="Enter notification preferences (comma-separated)"
                />
              </div>
              <div>
                <Label>ROI Target (%)</Label>
                <Input
                  type="number"
                  value={formData.marketingBudget.roiTarget}
                  onChange={handleInputChange('roiTarget')}
                  step={1}
                  min="0"
                  max="100"
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Frequency</Label>
                <select
                  className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  value={formData.marketingBudget.frequency}
                  onChange={handleInputChange('frequency')}
                >
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default UserMarketingCard;
