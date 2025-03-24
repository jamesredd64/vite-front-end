import { corsMiddleware } from '../middleware/cors';

export async function handler(req: Request) {
  // Create base response
  const response = new Response('OK', {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Apply CORS middleware
  return corsMiddleware(req, response);
}