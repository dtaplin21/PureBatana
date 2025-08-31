import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../lib/db';
import { reviews } from '../../lib/schema';
import { eq, desc } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const { productId } = req.query;
      
      let baseQuery = db.select().from(reviews) as any;
      
      if (productId) {
        baseQuery = baseQuery.where(eq(reviews.productId, parseInt(productId as string)));
      }
      
      const allReviews = await baseQuery.orderBy(desc(reviews.createdAt));

      return res.status(200).json({
        success: true,
        data: allReviews,
        total: allReviews.length,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error fetching reviews:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch reviews',
        message: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error',
        timestamp: new Date().toISOString()
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const { userId, productId, rating, comment, customerName } = req.body;

      if (!userId || !productId || !rating) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: userId, productId, and rating',
          timestamp: new Date().toISOString()
        });
      }

      const newReview = await db.insert(reviews).values({
        userId: parseInt(userId),
        productId: parseInt(productId),
        rating: parseInt(rating),
        comment: comment || null,
        customerName: customerName || null,
      }).returning();

      return res.status(201).json({
        success: true,
        data: newReview[0],
        message: 'Review created successfully',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error creating review:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return res.status(500).json({
        success: false,
        error: 'Failed to create review',
        message: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error',
        timestamp: new Date().toISOString()
      });
    }
  }

  return res.status(405).json({
    error: 'Method not allowed',
    allowed: ['GET', 'POST'],
    timestamp: new Date().toISOString()
  });
}
