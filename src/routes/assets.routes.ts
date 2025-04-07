import express from 'express';
import { staticFileMiddleware } from '../middleware/static.middleware';
import { staticConfig } from '../config/static.config';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Serve static files with middleware
router.use('/images', staticFileMiddleware);

// Get list of available images (admin only)
router.get('/images/list', async (req, res) => {
  try {
    const images: { [key: string]: string[] } = {};
    
    // Recursively read directory
    const readDir = (dir: string, base: string = '') => {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const relativePath = path.join(base, item);
        
        if (fs.statSync(fullPath).isDirectory()) {
          readDir(fullPath, relativePath);
        } else if (isValidImagePath(fullPath)) {
          const category = base || 'root';
          if (!images[category]) {
            images[category] = [];
          }
          images[category].push(relativePath);
        }
      });
    };

    readDir(staticConfig.imagesDir);
    
    res.json({
      success: true,
      data: images
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to list images'
    });
  }
});

export default router;