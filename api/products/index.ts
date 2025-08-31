import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../lib/db';
import { products } from '../../lib/schema';
import { eq, like, desc, asc } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      allowed: ['GET'],
      timestamp: new Date().toISOString()
    });
  }

  try {
    const { 
      category, 
      featured, 
      search, 
      sortBy = 'name', 
      sortOrder = 'asc',
      page = 1,
      limit = 20
    } = req.query;

    let query = db.select().from(products);

    // Apply filters
    if (category) {
      query = query.where(eq(products.category, category as string));
    }

    if (featured === 'true') {
      query = query.where(eq(products.featured, true));
    }

    if (search) {
      query = query.where(like(products.name, `%${search}%`));
    }

    // Apply sorting
    const sortColumn = sortBy as keyof typeof products;
    if (sortOrder === 'desc') {
      query = query.orderBy(desc(products[sortColumn]));
    } else {
      query = query.orderBy(asc(products[sortColumn]));
    }

    // Apply pagination
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    query = query.limit(parseInt(limit as string)).offset(offset);

    const allProducts = await query;

    // Get total count for pagination
    let countQuery = db.select({ count: products.id }).from(products);
    
    if (category) {
      countQuery = countQuery.where(eq(products.category, category as string));
    }
    if (featured === 'true') {
      countQuery = countQuery.where(eq(products.featured, true));
    }
    if (search) {
      countQuery = countQuery.where(like(products.name, `%${search}%`));
    }

    const totalCount = await countQuery;

    return res.status(200).json({
      success: true,
      data: allProducts,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: totalCount.length,
        pages: Math.ceil(totalCount.length / parseInt(limit as string))
      },
      filters: {
        category: category || null,
        featured: featured === 'true' || null,
        search: search || null
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}
