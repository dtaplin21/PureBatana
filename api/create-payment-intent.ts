import type { VercelRequest, VercelResponse } from '@vercel/node';
import stripe from './lib/stripe';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  console.log(`[${requestId}] Payment Intent Request Started at ${new Date().toISOString()}`);
  
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      allowed: ['POST'],
      timestamp: new Date().toISOString()
    });
  }

  try {
    console.log(`[${requestId}] Parsing request body...`);
    const { amount, orderItems = [], currency = 'usd', metadata = {} } = req.body;
    console.log(`[${requestId}] Amount: ${amount}, Currency: ${currency}`);

    if (!amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing amount',
        timestamp: new Date().toISOString()
      });
    }

    // Create payment intent with order details
    console.log(`[${requestId}] Creating Stripe payment intent...`);
    
    // Add retry logic for connection issues
    let paymentIntent;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        paymentIntent = await stripe.paymentIntents.create({
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
        break; // Success, exit retry loop
      } catch (retryError) {
        retryCount++;
        console.log(`[${requestId}] Retry ${retryCount}/${maxRetries} failed:`, retryError instanceof Error ? retryError.message : 'Unknown error');
        
        if (retryCount >= maxRetries) {
          throw retryError; // Re-throw the last error
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      }
    }

    console.log(`[${requestId}] Payment intent created successfully: ${paymentIntent.id}`);
    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`[${requestId}] Detailed Stripe Payment Intent Error:`, {
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
