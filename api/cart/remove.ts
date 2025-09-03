import type { VercelRequest, VercelResponse } from '@vercel/node';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('🔍 Starting cart remove endpoint...');
  
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
    
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'id is required',
        timestamp: new Date().toISOString()
      });
    }

    console.log('🔍 Request data:', { id });

    // Remove cart item
    const deleteQuery = `DELETE FROM cart_items WHERE id = ${id} RETURNING *`;
    const result = await db.execute(deleteQuery);
    
    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found',
        message: `Cart item with id ${id} does not exist`,
        timestamp: new Date().toISOString()
      });
    }
    
    console.log('✅ Cart item removed:', id);
    
    return res.status(200).json({
      success: true,
      message: 'Cart item removed successfully',
      data: result[0],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in cart remove endpoint:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return res.status(500).json({
      success: false,
      error: 'Failed to remove cart item',
      message: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error',
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined,
      timestamp: new Date().toISOString()
    });
  }
}