import React, { useState, useRef, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserProfileStore } from "../../stores/userProfileStore";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import UserMetadata from "../../types/user.js";
import Button from "../ui/button/Button";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  MarketingChannels,
  MarketingPlatforms,  
} from "../../types/marketing";

const NotificationChannels = [
  "Email",
  "Phone",
  "Push",
  "SMS",
  "Text",
  "Web",
] as const;

interface MarketingBudget {
  frequency: "daily" | "monthly" | "quarterly" | "yearly";
  adBudget: number;
  costPerAcquisition: number;
  dailySpendingLimit: number;
  marketingChannels: string; // Keep as string for backward compatibility
  monthlyBudget: number;
  preferredPlatforms: string; // Keep as string for backward compatibility
  notificationPreferences: string[];
  roiTarget: number;
}

interface UserMarketingCardProps {
  onUpdate: (newInfo: Partial<UserMetadata>) => void;
  initialData: {    
      marketingBudget: MarketingBudget;
    
  };
}

const MultiSelect: React.FC<{
  options: readonly string[];
  value: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
}> = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownListRef = useRef<HTMLDivElement>(null);
  const sortedOptions = [...options].sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Scroll dropdown list into view when it opens
    if (isOpen && dropdownListRef.current) {
      setTimeout(() => {
        dropdownListRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest"
        });
      }, 100); // Small delay to ensure dropdown is rendered
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleOption = (option: string) => {
    const newValue = value.includes(option)
      ? value.filter((v) => v !== option)
      : [...value, option];
    onChange(newValue);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected items display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="min-h-[40px] w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-brand-300 focus:outline-none focus:ring-1 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
      >
        {value.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {value.map((item) => (
              <span
                key={item}
                className="inline-flex items-center rounded-full bg-brand-50 px-2 py-1 text-xs text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"
              >
                {item}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-400 dark:text-gray-500">
            {placeholder}
          </span>
        )}
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div 
          ref={dropdownListRef}
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          {sortedOptions.map((option) => (
            <div
              key={option}
              className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => toggleOption(option)}
            >
              <div className="relative mr-3 flex h-5 w-5 items-center justify-center rounded border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700">
                {value.includes(option) && (
                  <svg
                    className="h-3.5 w-3.5 text-brand-500 dark:text-brand-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-200">
                {option}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const UserMarketingCard: React.FC<UserMarketingCardProps> = ({
  onUpdate,
  initialData,
}) => {
  const { user } = useAuth0();
  const userProfile = useUserProfileStore();
  const { isOpen, openModal, closeModal } = useModal();
  const [saveResult, setSaveResult] = useState<string | null>(null);

  // Helper function to format number as currency while typing
  const formatNumberAsCurrency = (value: string): string => {
    // Remove all non-digits/decimal
    const numericValue = value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    const wholePart = parts[0];
    const decimalPart = parts.length > 1 ? parts[1].slice(0, 2) : '';
    
    // Convert to number and format
    const numberValue = parseFloat(wholePart || '0') || 0;
    const formattedWholePart = new Intl.NumberFormat('en-US').format(numberValue);
    
    // Return formatted string
    if (value.includes('.')) {
      return `$${formattedWholePart}${decimalPart ? '.' + decimalPart : '.'}`;
    }
    return `$${formattedWholePart}`;
  };

  // Helper function to parse currency string to number
  const parseCurrencyToNumber = (value: string): number => {
    return Number(value.replace(/[^\d.]/g, '')) || 0;
  };

  const [formData, setFormData] = useState({
    marketingBudget: {
      frequency: initialData?.marketingBudget?.frequency || "monthly",
      adBudget: initialData?.marketingBudget?.adBudget || 0,
      costPerAcquisition: initialData?.marketingBudget?.costPerAcquisition || 0,
      dailySpendingLimit: initialData?.marketingBudget?.dailySpendingLimit || 0,
      marketingChannels: initialData?.marketingBudget?.marketingChannels || "",
      monthlyBudget: initialData?.marketingBudget?.monthlyBudget || 0,
      preferredPlatforms: initialData?.marketingBudget?.preferredPlatforms || "",
      notificationPreferences: initialData?.marketingBudget?.notificationPreferences || [],
      roiTarget: initialData?.marketingBudget?.roiTarget || 0,
    }
  });

  const handleInputChange = (field: keyof MarketingBudget) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    let processedValue = value;

    // Handle numeric/currency fields
    if (['adBudget', 'costPerAcquisition', 'dailySpendingLimit', 'monthlyBudget'].includes(field)) {
      // If the value is empty or just a dollar sign, set it to "$0"
      if (!value || value === '$') {
        processedValue = '$0';
      } else {
        // Remove the dollar sign before formatting if it exists
        const valueWithoutDollar = value.startsWith('$') ? value.slice(1) : value;
        processedValue = formatNumberAsCurrency(valueWithoutDollar);
      }
    } else if (field === 'roiTarget') {
      // Handle ROI as a plain number
      const numericValue = value.replace(/[^\d.]/g, '');
      processedValue = numericValue === '' ? '0' : numericValue;
    }

    const updates = {
      marketingBudget: {
        ...formData.marketingBudget,
        [field]: field === 'roiTarget' ? Number(processedValue) : processedValue,
      },
    };

    setFormData(prev => ({
      ...prev,
      ...updates
    }));
    userProfile.setHasUnsavedChanges(true);
  };

  const handleMarketingChannelsChange = (selected: string[]) => {
    const channelsString = selected.join(", ");
    setFormData((prev) => ({
      marketingBudget: {
        ...prev.marketingBudget,
        marketingChannels: channelsString,
      },
    }));
    userProfile.setHasUnsavedChanges(true);
  };

  const handlePlatformsChange = (selected: string[]) => {
    const platformsString = selected.join(", ");
    setFormData((prev) => ({
      marketingBudget: {
        ...prev.marketingBudget,
        preferredPlatforms: platformsString,
      },
    }));
    userProfile.setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    try {
      if (!user?.sub) return;
      
      // Process numeric fields during save
      const processedData = {
        marketingBudget: {
          ...formData.marketingBudget,
          adBudget: parseCurrencyToNumber(formData.marketingBudget.adBudget.toString()),
          costPerAcquisition: parseCurrencyToNumber(formData.marketingBudget.costPerAcquisition.toString()),
          dailySpendingLimit: parseCurrencyToNumber(formData.marketingBudget.dailySpendingLimit.toString()),
          monthlyBudget: parseCurrencyToNumber(formData.marketingBudget.monthlyBudget.toString()),
          roiTarget: Number(formData.marketingBudget.roiTarget) || 0, // Handle ROI separately
        }
      };

      onUpdate(processedData);
      closeModal();
    } catch (error) {
      console.error('Error saving marketing info:', error);
      setSaveResult('Error saving marketing preferences');
    }
  };

  // Initialize form data with formatted values
  useEffect(() => {
    setFormData({
      marketingBudget: {
        ...initialData.marketingBudget,
        adBudget: parseCurrencyToNumber(initialData.marketingBudget.adBudget.toString()),
        costPerAcquisition: parseCurrencyToNumber(initialData.marketingBudget.costPerAcquisition.toString()),
        dailySpendingLimit: parseCurrencyToNumber(initialData.marketingBudget.dailySpendingLimit.toString()),
        monthlyBudget: parseCurrencyToNumber(initialData.marketingBudget.monthlyBudget.toString()),
        roiTarget: parseCurrencyToNumber(initialData.marketingBudget.roiTarget.toString()),
      }
    });
  }, [initialData]);

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Marketing Information
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-7 2xl:gap-x-32">
              {/* <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Ad Budget
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(formData.marketingBudget.adBudget)}
                </p>
              </div> */}

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Cost Per Acquisition
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(formData.marketingBudget.costPerAcquisition))}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Budget
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(formData.marketingBudget.monthlyBudget))}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Marketing Channels
                </p>

                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formData.marketingBudget.marketingChannels
                    ? formData.marketingBudget.marketingChannels
                        .split(",")
                        .map((s: string) => s.trim())
                        .filter(Boolean)
                        .join(", ")
                    : "Not set"}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  PreferredPlatforms
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formData.marketingBudget.preferredPlatforms ||
                    "Not set".toUpperCase()}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Return On Interest
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formData.marketingBudget.roiTarget || "Not set"}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Frequency
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {(formData.marketingBudget.frequency || "Not set")
                    .charAt(0)
                    .toUpperCase() +
                    (formData.marketingBudget.frequency || "Not set")
                      .slice(1)
                      .toLowerCase()}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Notification Preferences
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formData.marketingBudget.notificationPreferences.length > 0
                    ? formData.marketingBudget.notificationPreferences.join(
                        ", "
                      )
                    : "Not set"}
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
        <div className="relative w-full p-4 overflow-y-auto bg-white border border-gray-200 dark:border-gray-700 no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
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
                {/* <div>
                  <Label>Ad Budget</Label>
                  <Input
                    type="number"
                    value={formData.marketingBudget.adBudget.toLocaleString()}
                    onChange={handleInputChange('adBudget')}
                    step={0.01}
                    min="0"
                    placeholder="0.00"
                    prefix="$"
                    isCurrency={true}
                  />
                </div> */}

                <div>
                  <Label>Cost Per Acquisition</Label>
                  <Input
                    type="number"
                    value={formData.marketingBudget.costPerAcquisition.toLocaleString()}
                    onChange={handleInputChange("costPerAcquisition")}
                    step={0.01}
                    min="0"
                    placeholder="0.00"
                    prefix="$"
                    isCurrency={true}
                  />
                </div>

                <div>
                  <Label>Budget</Label>
                  <Input
                    type="number"
                    value={formData.marketingBudget.monthlyBudget.toLocaleString()}
                    onChange={handleInputChange("monthlyBudget")}
                    step={0.01}
                    min="0"
                    placeholder="0.00"
                    prefix="$"
                    isCurrency={true}
                  />
                </div>

                <div>
                  <Label>Spending Limit</Label>
                  <Input
                    type="number"
                    value={formData.marketingBudget.dailySpendingLimit.toLocaleString()}
                    onChange={handleInputChange("dailySpendingLimit")}
                    step={0.01}
                    min="0"
                    placeholder="0.00"
                    prefix="$"
                    isCurrency={true}
                  />
                </div>
                <div>
                  <Label>Frequency</Label>
                  <select
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    value={formData.marketingBudget.frequency}
                    onChange={handleInputChange("frequency")}
                  >
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <Label>Marketing Channels</Label>
                  <Label className="mb-2 text-xsm font-semibold text-gray-800 dark:text-white/90">
                    Hold [cntrl] to select multiples
                  </Label>
                  <MultiSelect
                    options={MarketingChannels}
                    value={formData.marketingBudget.marketingChannels
                      .split(",")
                      .map((s: string) => s.trim())
                      .filter(Boolean)}
                    onChange={handleMarketingChannelsChange}
                    placeholder="Select marketing channels"
                  />
                </div>

                <div>
                  <Label>Preferred Platforms</Label>
                  <Label className="mb-2 text-xsm font-semibold text-gray-800 dark:text-white/90">
                    Hold [cntrl] to select multiples
                  </Label>
                  <MultiSelect
                    options={MarketingPlatforms}
                    value={formData.marketingBudget.preferredPlatforms
                      .split(",")
                      .map((s: string) => s.trim())
                      .filter(Boolean)}
                    onChange={handlePlatformsChange}
                    placeholder="Select preferred platforms"
                  />
                </div>

                <div className="lg:col-span-2">
                  <Label>Notification Preferences</Label>
                  <MultiSelect
                    options={NotificationChannels}
                    value={
                      typeof formData.marketingBudget
                        .notificationPreferences === "string"
                        ? (
                            formData.marketingBudget
                              .notificationPreferences as string
                          )
                            .split(",")
                            .map((s: string) => s.trim())
                            .filter(Boolean)
                        : formData.marketingBudget.notificationPreferences || []
                    }
                    onChange={(selected) => {
                      setFormData((prev) => ({
                        marketingBudget: {
                          ...prev.marketingBudget,
                          notificationPreferences: selected,
                        },
                      }));
                      userProfile.setHasUnsavedChanges(true);
                    }}
                    placeholder="Select notification preferences"
                  />
                </div>
                <div>
                  <Label>ROI Target (%)</Label>
                  <Input
                    type="number"
                    value={formData.marketingBudget.roiTarget}
                    onChange={handleInputChange("roiTarget")}
                    placeholder="0"
                    step={1}
                    min="0"
                    max="100"
                    
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
