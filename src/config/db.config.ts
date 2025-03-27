export const DB_CONFIG = {
  name: import.meta.env.VITE_MONGODB_DB_NAME || 'mongo_users-react',
  getQueryParam: () => `db=${DB_CONFIG.name}`,
  getHeaders: () => ({
    'X-Database-Name': DB_CONFIG.name
  })
} as const;