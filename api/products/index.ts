import type { VercelRequest, VercelResponse } from '@vercel/node';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('🔍 Starting products endpoint...');
  
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
    
    const { 
      category, 
      featured, 
      search, 
      sortBy = 'name', 
      sortOrder = 'asc',
      page = 1,
      limit = 20
    } = req.query;

    console.log('🔍 Query parameters:', { category, featured, search, sortBy, sortOrder, page, limit });

    // Build simple query without complex parameter binding
    let whereConditions: string[] = [];
    if (category) {
      whereConditions.push(`category = '${category}'`);
    }
    if (featured === 'true') {
      whereConditions.push(`featured = true`);
    }
    if (search) {
      whereConditions.push(`name ILIKE '%${search}%'`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // Build sorting
    let orderClause = 'ORDER BY name ASC'; // default
    if (sortBy === 'name') {
      orderClause = sortOrder === 'desc' ? 'ORDER BY name DESC' : 'ORDER BY name ASC';
    } else if (sortBy === 'price') {
      orderClause = sortOrder === 'desc' ? 'ORDER BY price DESC' : 'ORDER BY price ASC';
    } else if (sortBy === 'createdAt') {
      orderClause = sortOrder === 'desc' ? 'ORDER BY created_at DESC' : 'ORDER BY created_at ASC';
    }

    // Apply pagination
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    console.log('🔗 Fetching products...');
    const productsQuery = `
      SELECT * FROM products 
      ${whereClause} 
      ${orderClause} 
      LIMIT ${parseInt(limit as string)} OFFSET ${offset}
    `;
    
    const products = await db.execute(productsQuery);
    console.log('✅ Products fetched:', products.length);

    // Get total count for pagination
    const countQuery = `SELECT COUNT(*) as count FROM products ${whereClause}`;
    const countResult = await db.execute(countQuery);
    const totalCount = parseInt(String(countResult[0].count));

    console.log('✅ Total count:', totalCount);

    return res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit as string))
      },
      filters: {
        category: category || null,
        featured: featured === 'true' || null,
        search: search || null
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in products endpoint:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      message: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error',
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined,
      timestamp: new Date().toISOString()
    });
  }
}