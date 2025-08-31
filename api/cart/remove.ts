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
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Missing cart item ID',
        timestamp: new Date().toISOString()
      });
    }

    const result = await db.delete(cartItems).where(eq(cartItems.id, parseInt(id as string)));

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found',
        timestamp: new Date().toISOString()
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Cart item removed',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error removing cart item:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to remove cart item',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}
