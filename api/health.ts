import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      allowed: ['GET'],
      timestamp: new Date().toISOString()
    });
  }

  try {
    // Simple health check without database for now
    return res.status(200).json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      message: 'API is running'
    });

  } catch (error) {
    console.error('Health check failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return res.status(503).json({
      success: false,
      status: 'unhealthy',
      database: 'disconnected',
      error: process.env.NODE_ENV === 'development' ? errorMessage : 'Database connection failed',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  }
}
