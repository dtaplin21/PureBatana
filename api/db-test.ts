import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

// Ensure Node.js runtime for database operations
export const config = {
  runtime: 'nodejs'
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('🔍 Starting db-test endpoint...');
  
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
    console.log('- DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 20) + '...');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    console.log('🔧 Creating database connection...');
    
    // Configure for Vercel serverless environment
    neonConfig.fetchConnectionCache = true;
    neonConfig.useSecureWebSocket = true;
    
    // Create connection pool
    const pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      max: 1,
      idleTimeoutMillis: 0,
      connectionTimeoutMillis: 10000,
      ssl: true
    });
    
    console.log('✅ Connection pool created');
    
    // Create drizzle instance
    const db = drizzle(pool);
    console.log('✅ Drizzle database instance created');
    
    console.log('🔗 Testing database connection...');
    const result = await db.execute('SELECT 1 as test');
    console.log('✅ Database query successful:', result);
    
    return res.status(200).json({
      success: true,
      message: 'Database connection successful',
      result: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Database test failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return res.status(500).json({
      success: false,
      error: 'Database connection failed',
      message: process.env.NODE_ENV === 'development' ? errorMessage : 'Database connection failed',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
}
