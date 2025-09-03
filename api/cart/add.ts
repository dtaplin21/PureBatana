import type { VercelRequest, VercelResponse } from '@vercel/node';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('🔍 Starting cart add endpoint...');
  
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      allowed: ['POST'],
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
    
    const { userId, productId, quantity = 1 } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'userId and productId are required',
        timestamp: new Date().toISOString()
      });
    }

    console.log('🔍 Request data:', { userId, productId, quantity });

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

    // Check if item already exists in cart
    const existingItemQuery = `SELECT * FROM cart_items WHERE user_id = ${userId} AND product_id = ${productId}`;
    const existingItemResult = await db.execute(existingItemQuery);

    if (existingItemResult.length > 0) {
      // Update existing item quantity
      const newQuantity = existingItemResult[0].quantity + quantity;
      const updateQuery = `UPDATE cart_items SET quantity = ${newQuantity} WHERE user_id = ${userId} AND product_id = ${productId} RETURNING *`;
      const updateResult = await db.execute(updateQuery);
      
      console.log('✅ Cart item quantity updated');
      
      return res.status(200).json({
        success: true,
        message: 'Cart item quantity updated',
        data: updateResult[0],
        timestamp: new Date().toISOString()
      });
    } else {
      // Create new cart item
      const insertQuery = `INSERT INTO cart_items (user_id, product_id, quantity) VALUES (${userId}, ${productId}, ${quantity}) RETURNING *`;
      const insertResult = await db.execute(insertQuery);
      
      console.log('✅ New cart item created');
      
      return res.status(201).json({
        success: true,
        message: 'Item added to cart',
        data: insertResult[0],
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('❌ Error in cart add endpoint:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return res.status(500).json({
      success: false,
      error: 'Failed to add item to cart',
      message: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error',
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined,
      timestamp: new Date().toISOString()
    });
  }
}