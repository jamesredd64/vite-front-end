import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { staticConfig, isValidImagePath } from '../config/static.config';

export const staticFileMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Only handle GET requests
  if (req.method !== 'GET') {
    return next();
  }

  const filepath = path.join(staticConfig.baseDir, req.path);

  // Security check: Prevent directory traversal
  if (!filepath.startsWith(staticConfig.baseDir)) {
    return res.status(403).send('Forbidden');
  }

  // Verify file exists
  if (!fs.existsSync(filepath)) {
    return res.status(404).send('File not found');
  }

  // Verify it's an allowed image type
  if (!isValidImagePath(filepath)) {
    return res.status(403).send('Invalid file type');
  }

  // Get file stats
  const stats = fs.statSync(filepath);

  // Check file size
  if (stats.size > staticConfig.maxFileSize) {
    return res.status(413).send('File too large');
  }

  // Set cache control headers
  res.setHeader('Cache-Control', `public, max-age=${staticConfig.cacheControl.maxAge}`);
  res.setHeader('Content-Type', `image/${path.extname(filepath).substring(1)}`);
  
  // Stream the file
  fs.createReadStream(filepath).pipe(res);
};