import type { VercelRequest, VercelResponse } from '@vercel/node';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('🔍 Starting reviews by product endpoint...');
  
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      allowed: ['GET'],
      timestamp: new Date().toISOString()
    });
  }

  try {
    console.log('📋 Environment check:');
    console.log('- DATABASE_URL exists:', !!process.env.DATABASE_URL);
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    console.log('🔧 Creating database connection...');
    
    // Create postgres connection for Drizzle
    const connectionString = process.env.DATABASE_URL;
    const sql = postgres(connectionString, { 
      max: 1,
      idle_timeout: 0,
      connect_timeout: 10,
      ssl: 'require'
    });
    
    const db = drizzle(sql);
    console.log('✅ Drizzle database instance created');
    
    const { productId } = req.query;
    
    if (!productId || typeof productId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Product ID is required',
        timestamp: new Date().toISOString()
      });
    }

    const productIdNum = parseInt(productId);
    if (isNaN(productIdNum)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID',
        timestamp: new Date().toISOString()
      });
    }

    console.log('🔍 Fetching reviews for product ID:', productIdNum);

    // Query for reviews with user and product information
    const reviewsQuery = `
      SELECT 
        r.*,
        u.name as user_name,
        u.email as user_email,
        p.name as product_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN products p ON r.product_id = p.id
      WHERE r.product_id = ${productIdNum}
      ORDER BY r.created_at DESC
    `;
    
    const reviews = await db.execute(reviewsQuery);
    console.log('✅ Reviews query executed, found:', reviews.length);

    return res.status(200).json({
      success: true,
      data: reviews,
      count: reviews.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in reviews by product endpoint:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews',
      message: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error',
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined,
      timestamp: new Date().toISOString()
    });
  }
}
