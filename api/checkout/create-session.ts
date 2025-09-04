import type { VercelRequest, VercelResponse } from '@vercel/node';
import stripe from '../lib/stripe';

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

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: orderItems.map((item: any) => ({
        price_data: {
          currency: currency,
          product_data: {
            name: `Product ${item.id}`,
            description: `Quantity: ${item.quantity}`,
          },
          unit_amount: Math.round(item.price || amount / orderItems.length), // Price per item in cents
        },
        quantity: item.quantity || 1,
      })),
      mode: 'payment',
      success_url: `${req.headers.origin || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'http://localhost:3000'}/cart`,
      metadata: {
        ...metadata,
        orderItems: JSON.stringify(orderItems),
        orderTotal: amount.toString(),
      },
      customer_email: metadata.email,
    });

    return res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Detailed Stripe Checkout Session Error:', {
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
      error: 'Failed to create checkout session',
      message: errorMessage,
      details: {
        type: (error as any)?.type,
        code: (error as any)?.code,
        statusCode: (error as any)?.statusCode,
        requestId: (error as any)?.requestId
      },
      timestamp: new Date().toISOString()
    });
  }
}
