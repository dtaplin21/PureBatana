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

    // Build base query with type assertion to bypass Drizzle type issues
    let baseQuery = db.select().from(products) as any;
    
    // Apply filters one by one
    if (category) {
      baseQuery = baseQuery.where(eq(products.category, category as string));
    }
    
    if (featured === 'true') {
      baseQuery = baseQuery.where(eq(products.featured, true));
    }
    
    if (search) {
      baseQuery = baseQuery.where(like(products.name, `%${search}%`));
    }

    // Apply sorting safely with type assertion
    let sortedQuery = baseQuery;
    if (sortBy === 'name') {
      if (sortOrder === 'desc') {
        sortedQuery = sortedQuery.orderBy(desc(products.name));
      } else {
        sortedQuery = sortedQuery.orderBy(asc(products.name));
      }
    } else if (sortBy === 'price') {
      if (sortOrder === 'desc') {
        sortedQuery = sortedQuery.orderBy(desc(products.price));
      } else {
        sortedQuery = sortedQuery.orderBy(asc(products.price));
      }
    } else if (sortBy === 'createdAt') {
      if (sortOrder === 'desc') {
        sortedQuery = sortedQuery.orderBy(desc(products.createdAt));
      } else {
        sortedQuery = sortedQuery.orderBy(asc(products.createdAt));
      }
    } else {
      // Default sorting
      sortedQuery = sortedQuery.orderBy(asc(products.name));
    }

    // Apply pagination
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    const paginatedQuery = sortedQuery.limit(parseInt(limit as string)).offset(offset);

    const allProducts = await paginatedQuery;

    // Get total count for pagination - use a separate simple query with type assertion
    let countQuery = db.select({ count: products.id }).from(products) as any;
    
    if (category) {
      countQuery = countQuery.where(eq(products.category, category as string));
    }
    if (featured === 'true') {
      countQuery = countQuery.where(eq(products.featured, true));
    }
    if (search) {
      countQuery = countQuery.where(like(products.name, `%${search}%`));
    }

    const totalCountResult = await countQuery;
    const totalCount = totalCountResult.length;

    return res.status(200).json({
      success: true,
      data: allProducts,
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
    console.error('Error fetching products:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      message: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}
