import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../lib/db';
import { products } from '../lib/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      allowed: ['GET'],
      timestamp: new Date().toISOString()
    });
  }

  try {
    // Simple products query without complex filtering
    const allProducts = await db.select().from(products);

    return res.status(200).json({
      success: true,
      data: allProducts,
      count: allProducts.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      message: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}
