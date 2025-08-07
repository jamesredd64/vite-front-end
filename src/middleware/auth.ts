// import { Request, Response, NextFunction } from 'express';
// import { auth } from 'express-oauth2-jwt-bearer';

// // Auth0 JWT validation middleware
// const validateAuth0Token = auth({
//   audience: process.env.VITE_AUTH0_AUDIENCE,
//   issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
// });

// // Custom interface to extend Express Request
// interface AuthRequest extends Request {
//   user?: {
//     sub: string;
//     permissions?: string[];
//   };
// }

// // Middleware to require authentication
// export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     await validateAuth0Token(req, res, next);
//   } catch (error) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }
// };

// // Middleware to require admin role
// export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
//   try {
//     const user = await getModels().User.findOne({ auth0Id: req.user?.sub });
    
//     if (!user || user.profile?.role !== 'admin') {
//       return res.status(403).json({ error: 'Forbidden - Admin access required' });
//     }
    
//     next();
//   } catch (error) {
//     console.error('Admin verification error:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };