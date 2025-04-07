export interface ApiEndpoints {
  USERS: string;
  USER_BY_ID: (id: string) => string;
  USER_BY_EMAIL: (email: string) => string;
  SAVE_USER_DATA: (id: string) => string;
  USER_CALENDAR_EVENTS: (id: string) => string;
  NOTIFICATIONS: string;
  USER_NOTIFICATIONS: (id: string) => string;
  ASSETS: {
    UPLOAD: string;
    DELETE: (filename: string) => string;
  };
}

export interface ApiConfig {
  BASE_URL: string;
  ENDPOINTS: ApiEndpoints;
}

export interface ApiService {
  getUsers: () => Promise<unknown>;
  getUserById: (id: string) => Promise<unknown>;
  updateUser: (id: string, data: import('../types/user').default) => Promise<unknown>;
  uploadImage: (file: File) => Promise<unknown>;
  deleteImage: (filename: string) => Promise<unknown>;
}

export const API_CONFIG: ApiConfig;
export const getApiUrl: () => string;
export const getImageUrl: (imagePath: string) => string;
export const useApiService: () => ApiService;
