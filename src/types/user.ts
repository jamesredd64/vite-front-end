interface UserMetadata {
  auth0Id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profile: {    
    dateOfBirth: string | null;
    gender: string;
    profilePictureUrl: string;
    
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
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
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export default UserMetadata;
