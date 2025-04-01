import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserProfileStore } from '../../stores/userProfileStore';
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import  UserMetadata  from "../../types/user.js";
import Button from "../ui/button/Button";


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
  const [saveResult, setSaveResult] = useState<string | null>(null);
  
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

    if (JSON.stringify(formData) !== JSON.stringify(newFormData)) {
      setFormData(newFormData);
    }
  }, [initialData]);

  const handleInputChange = (field: keyof MarketingBudget) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({
      marketingBudget: {
        ...prev.marketingBudget,
        [field]: 
          field === 'notificationPreferences' ? 
            (typeof value === 'string' ? value.split(',').map(v => v.trim()).filter(Boolean) : []) :
          field === 'marketingChannels' || field === 'preferredPlatforms' ? 
            value :
          field === 'frequency' ? 
            value :
          field === 'adBudget' || 
          field === 'costPerAcquisition' || 
          field === 'dailySpendingLimit' || 
          field === 'monthlyBudget' || 
          field === 'roiTarget' ? 
            Number(value) || 0 :
          value
      }
    }));
    userProfile.setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    try {
      if (!user?.sub) return;
      onUpdate({
        marketingBudget: {
          ...formData.marketingBudget
        }
      });
      closeModal();
    } catch (error) {
      console.error('Error saving marketing info:', error);
      setSaveResult('Error saving marketing information');
    }
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Marketing Information
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Ad Budget
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(formData.marketingBudget.adBudget)}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Cost Per Acquisition
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(formData.marketingBudget.costPerAcquisition)}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Monthly Budget
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(formData.marketingBudget.monthlyBudget)}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Marketing Channels
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formData.marketingBudget.marketingChannels || 'Not set'}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                PreferredPlatforms
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formData.marketingBudget.preferredPlatforms || 'Not set'}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Return On Interest
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formData.marketingBudget.roiTarget || 'Not set'}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Frequency
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formData.marketingBudget.frequency || 'Not set'}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Return On Interest
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formData.marketingBudget.notificationPreferences || 'Not set'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              />
            </svg>
            Edit
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Marketing Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your marketing details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Ad Budget</Label>
                  <Input
                    type="number"
                    value={formData.marketingBudget.adBudget}
                    onChange={handleInputChange('adBudget')}
                    step={0.01}
                    min="0"
                    placeholder="0.00"
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
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    value={formData.marketingBudget.frequency}
                    onChange={handleInputChange('frequency')}
                  >
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div className="lg:col-span-2">
                  <Label>Notification Preferences</Label>
                  <Input
                    type="text"
                    value={formData.marketingBudget.notificationPreferences.join(', ')}
                    onChange={handleInputChange('notificationPreferences')}
                    placeholder="Enter notification preferences (comma-separated)"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <Button onClick={closeModal} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleSave} variant="primary">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {saveResult && (
        <div className="mt-4 p-4 rounded-lg bg-red-100 dark:bg-red-900">
          <p className="text-red-700 dark:text-red-300">{saveResult}</p>
        </div>
      )}
    </>
  );
};

export default UserMarketingCard;
