import path from 'path';

export const staticConfig = {
  // Base directory for all static assets
  baseDir: path.join(process.cwd(), 'public'),
  
  // Images directory
  imagesDir: path.join(process.cwd(), 'public', 'images'),
  
  // Allowed image extensions
  allowedImageExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'],
  
  // Cache control headers
  cacheControl: {
    public: true,
    maxAge: 86400, // 24 hours
    immutable: true
  },
  
  // Maximum file size (5MB)
  maxFileSize: 5 * 1024 * 1024
};

export const isValidImagePath = (filepath: string): boolean => {
  const ext = path.extname(filepath).toLowerCase();
  return staticConfig.allowedImageExtensions.includes(ext);
};