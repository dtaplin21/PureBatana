import type { VercelRequest, VercelResponse } from '@vercel/node';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('🔍 Starting cart clear endpoint...');
  
  if (req.method !== 'DELETE') {
    return res.status(405).json({
      error: 'Method not allowed',
      allowed: ['DELETE'],
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
    
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'userId is required',
        timestamp: new Date().toISOString()
      });
    }

    console.log('🔍 Request data:', { userId });

    // Clear cart for user
    const deleteQuery = `DELETE FROM cart_items WHERE user_id = ${userId}`;
    const result = await db.execute(deleteQuery);
    
    console.log('✅ Cart cleared for user:', userId);
    
    return res.status(200).json({
      success: true,
      message: `Cleared cart items for user ${userId}`,
      itemsRemoved: result.length || 0,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in cart clear endpoint:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return res.status(500).json({
      success: false,
      error: 'Failed to clear cart',
      message: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error',
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined,
      timestamp: new Date().toISOString()
    });
  }
}