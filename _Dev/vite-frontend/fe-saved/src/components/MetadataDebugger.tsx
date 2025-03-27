import { useGlobalStorage } from '../hooks/useGlobalStorage';

interface UserMetadata {
  adBudget: number;
  costPerAcquisition: number;
  dailySpendingLimit: number;
  marketingChannels: string;
  monthlyBudget: number;
  preferredPlatforms: string;
  notificationPreferences: boolean;
  roiTarget: number;
  name: string;
  nickname: string;
  roles: string[];
  email: string;
  picture: string;
}

export const MetadataDebugger = () => {
  const [metadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      maxWidth: '300px',
      zIndex: 9999
    }}>
      <h4>Global Storage Debug</h4>
      <pre style={{ fontSize: '12px' }}>
        {JSON.stringify(metadata, null, 2)}
      </pre>
    </div>
  );
};