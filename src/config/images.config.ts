const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export const getImageUrl = (path: string): string => {
  return `${API_URL}/images/${path}`;
};
