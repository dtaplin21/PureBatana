import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

export const config = { runtime: 'nodejs' };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('🔍 Starting check-products-table endpoint...');
  
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
    
    neonConfig.fetchConnectionCache = true;
    neonConfig.useSecureWebSocket = true;
    
    const pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      max: 1,
      idleTimeoutMillis: 0,
      connectionTimeoutMillis: 10000,
      ssl: true
    });
    
    console.log('✅ Connection pool created');
    
    const db = drizzle(pool);
    console.log('✅ Drizzle database instance created');
    
    console.log('🔗 Checking if products table exists...');
    const tableCheck = await db.execute(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      );
    `);
    console.log('✅ Table check successful:', tableCheck);
    
    console.log('🔗 Getting table count...');
    const countResult = await db.execute('SELECT COUNT(*) as count FROM products');
    console.log('✅ Count query successful:', countResult);

    return res.status(200).json({
      success: true,
      tableExists: tableCheck.rows[0]?.exists || false,
      productCount: countResult.rows[0]?.count || 0,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error checking products table:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return res.status(500).json({
      success: false,
      error: 'Failed to check products table',
      message: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
}
