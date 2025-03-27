import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface CustomClaims {
  adBudget: number;
  costPerAcquisition: number;
  dailySpendingLimit: number;
  marketingChannels: string;
  monthlyBudget: number;
  preferredPlatforms: string;
  notificationPreferences: boolean;
  roiTarget: number;
  roles: string[];
}

const FetchCustomClaims = () => {
  const { getIdTokenClaims } = useAuth0();
  const [claimsData, setClaimsData] = useState<CustomClaims | null>(null);

  const fetchCustomClaims = async () => {
    try {
      const claims = await getIdTokenClaims();
      const namespace = 'https://dev-uizu7j8qzflxzjpy.jr.com';
      
      if (!claims) {
        throw new Error('Failed to fetch claims');
      }

      const customClaims = {
        adBudget: claims[`${namespace}/adBudget`],
        costPerAcquisition: claims[`${namespace}/costPerAcquisition`],
        dailySpendingLimit: claims[`${namespace}/dailySpendingLimit`],
        marketingChannels: claims[`${namespace}/marketingChannels`],
        monthlyBudget: claims[`${namespace}/monthlyBudget`],
        preferredPlatforms: claims[`${namespace}/preferredPlatforms`],
        notificationPreferences: claims[`${namespace}/notificationPreferences`],
        roiTarget: claims[`${namespace}/roiTarget`],
        roles: claims[`${namespace}/roles`],
      };

      setClaimsData(customClaims);
    } catch (error) {
      console.error('Error fetching custom claims:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <button 
        onClick={fetchCustomClaims}
        style={{
          padding: '10px 20px',
          margin: '20px 0',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        Fetch Custom Claims
      </button>

      {claimsData && (
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '20px', 
          borderRadius: '8px',
          maxWidth: '600px'
        }}>
          <h2>Custom Claims Data</h2>
          <div style={{ display: 'grid', gap: '10px' }}>
            <div>
              <strong>Ad Budget:</strong> ${claimsData.adBudget?.toLocaleString()}
            </div>
            <div>
              <strong>Cost Per Acquisition:</strong> ${claimsData.costPerAcquisition?.toLocaleString()}
            </div>
            <div>
              <strong>Daily Spending Limit:</strong> ${claimsData.dailySpendingLimit?.toLocaleString()}
            </div>
            <div>
              <strong>Marketing Channels:</strong> {claimsData.marketingChannels}
            </div>
            <div>
              <strong>Monthly Budget:</strong> ${claimsData.monthlyBudget?.toLocaleString()}
            </div>
            <div>
              <strong>Preferred Platforms:</strong> {claimsData.preferredPlatforms}
            </div>
            <div>
              <strong>Notification Preferences:</strong> {claimsData.notificationPreferences ? 'Enabled' : 'Disabled'}
            </div>
            <div>
              <strong>ROI Target:</strong> {(claimsData.roiTarget * 100).toFixed(1)}%
            </div>
            <div>
              <strong>Roles:</strong> {Array.isArray(claimsData.roles) ? claimsData.roles.join(', ') : claimsData.roles}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FetchCustomClaims;
