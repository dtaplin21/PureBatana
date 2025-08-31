import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../lib/db';
import { cartItems } from '../../lib/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({
      error: 'Method not allowed',
      allowed: ['DELETE'],
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

    const result = await db.delete(cartItems).where(eq(cartItems.userId, parseInt(userId as string)));

    return res.status(200).json({
      success: true,
      message: `Cleared ${result.rowCount} cart items`,
      itemsRemoved: result.rowCount,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error clearing cart:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to clear cart',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}
