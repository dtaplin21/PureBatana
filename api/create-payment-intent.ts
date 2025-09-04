import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
      amount: Math.round(amount), // Amount is already in cents
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
    console.error('Detailed Stripe Payment Intent Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      type: (error as any)?.type,
      code: (error as any)?.code,
      statusCode: (error as any)?.statusCode,
      requestId: (error as any)?.requestId,
      stack: error instanceof Error ? error.stack : undefined
    });
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return res.status(500).json({
      success: false,
      error: 'Failed to create payment intent',
      message: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? {
        type: (error as any)?.type,
        code: (error as any)?.code,
        statusCode: (error as any)?.statusCode
      } : undefined,
      timestamp: new Date().toISOString()
    });
  }
}
