// This will be automatically updated by our build script
export const VERSION = {
  number: '2.0.25',  // Remove the -0 suffix
  buildDate: new Date().toISOString(),
  environment: import.meta.env.MODE,
  isVercel: import.meta.env.PROD && !!import.meta.env.VERCEL,
};
