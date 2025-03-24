// Import the CORS lib code you provided here
// ... [CORS lib code] ...

// Create a configured CORS middleware instance
export const corsMiddleware = initCors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5000',
    'https://vite-front-end.vercel.app',
    'https://admin-backend-eta.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'X-CSRF-Token',
    'X-Requested-With',
    'Accept',
    'Accept-Version',
    'Content-Length',
    'Content-MD5',
    'Content-Type',
    'Date',
    'X-Api-Version',
    'Authorization'
  ],
  credentials: true,
  maxAge: 86400 // 24 hours
});