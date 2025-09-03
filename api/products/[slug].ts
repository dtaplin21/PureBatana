import type { VercelRequest, VercelResponse } from '@vercel/node';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('🔍 Starting product by slug endpoint...');
  
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
    
    const { slug } = req.query;
    
    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Product slug is required',
        timestamp: new Date().toISOString()
      });
    }

    console.log('🔍 Fetching product with slug:', slug);

    // Query for the specific product by slug
    const productQuery = `
      SELECT * FROM products 
      WHERE slug = '${slug}'
      LIMIT 1
    `;
    
    const products = await db.execute(productQuery);
    console.log('✅ Product query executed, found:', products.length);

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        message: `No product found with slug: ${slug}`,
        timestamp: new Date().toISOString()
      });
    }

    const product = products[0];
    console.log('✅ Product found:', product.name);

    // Get review count for this product
    const reviewCountQuery = `
      SELECT COUNT(*) as count FROM reviews 
      WHERE product_id = ${product.id}
    `;
    
    const reviewCountResult = await db.execute(reviewCountQuery);
    const reviewCount = parseInt(String(reviewCountResult[0].count));

    console.log('✅ Review count:', reviewCount);

    // Add review count to product
    const productWithMeta = {
      ...product,
      reviewCount
    };

    return res.status(200).json({
      success: true,
      data: productWithMeta,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in product by slug endpoint:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
      message: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error',
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined,
      timestamp: new Date().toISOString()
    });
  }
}
