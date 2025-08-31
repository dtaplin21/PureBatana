import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../lib/db';
import { orders } from '../../lib/schema';
import { eq, desc } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      allowed: ['GET'],
      timestamp: new Date().toISOString()
    });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing userId',
        timestamp: new Date().toISOString()
      });
    }

    const userOrders = await db.select().from(orders)
      .where(eq(orders.userId, parseInt(userId as string)))
      .orderBy(desc(orders.createdAt));

    return res.status(200).json({
      success: true,
      data: userOrders,
      total: userOrders.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch orders',
      message: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}
