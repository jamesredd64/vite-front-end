import { useGlobalStorage } from './useGlobalStorage';
import { UserMetadata } from '../types/user';

export const useAdmin = () => {
  const [userMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);

  const isAdmin = (): boolean => {
    return userMetadata?.profile?.role === 'admin';
  };

  return { isAdmin };
};