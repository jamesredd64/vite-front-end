interface UserMetadata {
  auth0Id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  phoneNumber: string;
  profile: {    
    // gender?: string;
    profilePictureUrl?: string;
    
  };
  marketingBudget: {
    adBudget: number;
    costPerAcquisition: number;
    dailySpendingLimit: number;
    marketingChannels: string;
    monthlyBudget: number;
    preferredPlatforms: string;
    notificationPreferences: string[];
    roiTarget: number;
    frequency: "daily" | "monthly" | "quarterly" | "yearly";
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export default UserMetadata;
