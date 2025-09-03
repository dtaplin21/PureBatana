import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { pgTable, serial, text, integer, boolean, timestamp, json } from 'drizzle-orm/pg-core';

// Ensure Node.js runtime for database operations
export const config = {
  runtime: 'nodejs'
};

// Define products schema locally (self-contained)
const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  shortDescription: text('short_description'),
  price: integer('price').notNull(),
  images: json('images').$type<string[]>(),
  category: text('category').notNull(),
  stock: integer('stock').default(0),
  featured: boolean('featured').default(false),
  benefits: json('benefits').$type<string[]>(),
  usage: text('usage'),
  isBestseller: boolean('is_bestseller').default(false),
  isNew: boolean('is_new').default(false),
  viewCount: integer('view_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('🔍 Starting products-simple endpoint...');
  
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
    
    // Create drizzle instance with schema
    const db = drizzle(pool, { schema: { products } });
    console.log('✅ Drizzle database instance created with schema');
    
    console.log('🔗 Querying products...');
    // Simple products query without complex filtering
    const allProducts = await db.select().from(products);
    console.log('✅ Products query successful, found:', allProducts.length, 'products');

    return res.status(200).json({
      success: true,
      data: allProducts,
      count: allProducts.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error fetching products:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      message: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
}
