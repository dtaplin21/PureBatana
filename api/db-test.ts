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
    // Simple database connection test
    const result = await db.execute('SELECT 1 as test');
    
    return res.status(200).json({
      success: true,
      message: 'Database connection successful',
      result: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Database test failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return res.status(500).json({
      success: false,
      error: 'Database connection failed',
      message: process.env.NODE_ENV === 'development' ? errorMessage : 'Database connection failed',
      timestamp: new Date().toISOString()
    });
  }
}
