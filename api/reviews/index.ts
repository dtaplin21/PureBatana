import type { VercelRequest, VercelResponse } from '@vercel/node';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('🔍 Starting reviews endpoint...');
  
  if (req.method === 'GET') {
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

      console.log('🔍 Query parameters:', { productId });

      if (productId) {
        // Get reviews for specific product
        const reviewsQuery = `
          SELECT r.*, 
                 u.name as user_name,
                 u.email as user_email
          FROM reviews r
          LEFT JOIN users u ON r.user_id = u.id
          WHERE r.product_id = ${productId}
          ORDER BY r.created_at DESC
        `;
        
        const reviews = await db.execute(reviewsQuery);
        console.log('✅ Product reviews fetched:', reviews.length);
        
        return res.status(200).json({
          success: true,
          data: reviews,
          count: reviews.length,
          timestamp: new Date().toISOString()
        });
      } else {
        // Get all reviews
        const reviewsQuery = `
          SELECT r.*, 
                 u.name as user_name,
                 u.email as user_email,
                 p.name as product_name
          FROM reviews r
          LEFT JOIN users u ON r.user_id = u.id
          LEFT JOIN products p ON r.product_id = p.id
          ORDER BY r.created_at DESC
        `;
        
        const reviews = await db.execute(reviewsQuery);
        console.log('✅ All reviews fetched:', reviews.length);
        
        return res.status(200).json({
          success: true,
          data: reviews,
          count: reviews.length,
          timestamp: new Date().toISOString()
        });
      }

    } catch (error) {
      console.error('❌ Error in reviews GET endpoint:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch reviews',
        message: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined,
        timestamp: new Date().toISOString()
      });
    }
  } else if (req.method === 'POST') {
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
      
      const { userId, productId, rating, comment, customerName } = req.body;

      if (!userId || !productId || !rating) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          message: 'userId, productId, and rating are required',
          timestamp: new Date().toISOString()
        });
      }

      console.log('🔍 Request data:', { userId, productId, rating, comment, customerName });

      // Check if product exists
      const productQuery = `SELECT * FROM products WHERE id = ${productId}`;
      const productResult = await db.execute(productQuery);
      
      if (productResult.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Product not found',
          message: `Product with id ${productId} does not exist`,
          timestamp: new Date().toISOString()
        });
      }

      // Create review
      const insertQuery = `
        INSERT INTO reviews (user_id, product_id, rating, comment, customer_name) 
        VALUES (${userId}, ${productId}, ${rating}, '${comment || ''}', '${customerName || ''}') 
        RETURNING *
      `;
      
      const insertResult = await db.execute(insertQuery);
      
      console.log('✅ Review created');
      
      return res.status(201).json({
        success: true,
        message: 'Review created successfully',
        data: insertResult[0],
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Error in reviews POST endpoint:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return res.status(500).json({
        success: false,
        error: 'Failed to create review',
        message: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined,
        timestamp: new Date().toISOString()
      });
    }
  } else {
    return res.status(405).json({
      error: 'Method not allowed',
      allowed: ['GET', 'POST'],
      timestamp: new Date().toISOString()
    });
  }
}