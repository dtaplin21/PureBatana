import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      allowed: ['POST'],
      timestamp: new Date().toISOString()
    });
  }

  try {
    const { amount, orderItems = [], currency = 'usd', metadata = {} } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing amount',
        timestamp: new Date().toISOString()
      });
    }

    // Create payment intent with order details
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        ...metadata,
        orderItems: JSON.stringify(orderItems),
        orderTotal: amount.toString(),
      },
      automatic_payment_methods: {
        enabled: true,
      },
      // Add customer details if available
      receipt_email: metadata.email,
      description: `Order for ${metadata.customerName || 'Customer'}`,
    });

    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create payment intent',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}
