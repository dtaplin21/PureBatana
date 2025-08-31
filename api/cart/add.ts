import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../lib/db';
import { cartItems, products } from '../../lib/schema';
import { eq, and } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      allowed: ['POST'],
      timestamp: new Date().toISOString()
    });
  }

  try {
    const { userId, productId, quantity = 1 } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId and productId',
        timestamp: new Date().toISOString()
      });
    }

    // Check if product exists
    const product = await db.select().from(products).where(eq(products.id, productId)).limit(1);
    if (product.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        timestamp: new Date().toISOString()
      });
    }

    // Check if item already in cart
    const existingItem = await db.select().from(cartItems).where(
      and(eq(cartItems.userId, userId), eq(cartItems.productId, productId))
    ).limit(1);

    if (existingItem.length > 0) {
      // Update quantity
      const updatedItem = await db.update(cartItems)
        .set({ quantity: existingItem[0].quantity + quantity })
        .where(eq(cartItems.id, existingItem[0].id))
        .returning();

      return res.status(200).json({
        success: true,
        data: updatedItem[0],
        message: 'Cart item quantity updated',
        timestamp: new Date().toISOString()
      });
    } else {
      // Add new item
      const newItem = await db.insert(cartItems).values({
        userId,
        productId,
        quantity
      }).returning();

      return res.status(201).json({
        success: true,
        data: newItem[0],
        message: 'Item added to cart',
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('Error adding to cart:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return res.status(500).json({
      success: false,
      error: 'Failed to add item to cart',
      message: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}
