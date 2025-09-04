import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('🔍 Starting Stripe test endpoint...');
  
  try {
    // Test 1: Check if Stripe key exists
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        error: 'STRIPE_SECRET_KEY not found',
        timestamp: new Date().toISOString()
      });
    }
    
    console.log('✅ Stripe key found, length:', process.env.STRIPE_SECRET_KEY.length);
    
    // Test 2: Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    console.log('✅ Stripe instance created');
    
    // Test 3: Try to retrieve account info (simple API call)
    const account = await stripe.accounts.retrieve();
    console.log('✅ Account retrieved:', account.id);
    
    // Test 4: Try to create a simple payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100, // $1.00
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });
    console.log('✅ Payment intent created:', paymentIntent.id);
    
    return res.status(200).json({
      success: true,
      message: 'All Stripe tests passed',
      data: {
        accountId: account.id,
        paymentIntentId: paymentIntent.id,
        stripeKeyLength: process.env.STRIPE_SECRET_KEY.length,
        stripeKeyPrefix: process.env.STRIPE_SECRET_KEY.substring(0, 7) + '...'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Stripe test failed:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      type: (error as any)?.type,
      code: (error as any)?.code,
      statusCode: (error as any)?.statusCode,
      requestId: (error as any)?.requestId,
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return res.status(500).json({
      success: false,
      error: 'Stripe test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
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
