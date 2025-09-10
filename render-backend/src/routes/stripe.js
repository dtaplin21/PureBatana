import express from 'express';
import stripe from '../config/stripe.js';

const router = express.Router();

// Health check for Stripe
router.get('/test', async (req, res) => {
  try {
    console.log('🔍 Testing Stripe connection...');
    
    // Test Stripe connection
    const account = await stripe.accounts.retrieve();
    console.log('✅ Stripe account retrieved:', account.id);
    
    // Test payment intent creation
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100, // $1.00
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });
    console.log('✅ Payment intent created:', paymentIntent.id);
    
    res.json({
      success: true,
      message: 'Stripe connection successful',
      data: {
        accountId: account.id,
        paymentIntentId: paymentIntent.id,
        accountName: account.business_profile?.name || 'Unknown',
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Stripe test failed:', error);
    res.status(500).json({
      success: false,
      error: 'Stripe connection failed',
      message: error.message,
      details: {
        type: error.type,
        code: error.code,
        statusCode: error.statusCode
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Create Payment Intent
router.post('/create-payment-intent', async (req, res) => {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  console.log(`[${requestId}] Creating payment intent...`);
  
  try {
    const { amount, orderItems = [], currency = 'usd', metadata = {} } = req.body;
    
    if (!amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing amount',
        timestamp: new Date().toISOString()
      });
    }
    
    console.log(`[${requestId}] Amount: ${amount}, Currency: ${currency}`);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount is already in cents
      currency,
      metadata: {
        ...metadata,
        orderItems: JSON.stringify(orderItems),
        orderTotal: amount.toString(),
        requestId
      },
      automatic_payment_methods: {
        enabled: true,
      },
      receipt_email: metadata.email,
      description: `Order for ${metadata.customerName || 'Customer'}`,
    });
    
    console.log(`[${requestId}] Payment intent created: ${paymentIntent.id}`);
    
    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error(`[${requestId}] Payment intent creation failed:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment intent',
      message: error.message,
      details: {
        type: error.type,
        code: error.code,
        statusCode: error.statusCode
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Create Checkout Session
router.post('/create-checkout-session', async (req, res) => {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  console.log(`[${requestId}] Creating checkout session...`);
  
  try {
    const { amount, orderItems = [], currency = 'usd', metadata = {} } = req.body;
    
    if (!amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing amount',
        timestamp: new Date().toISOString()
      });
    }
    
    console.log(`[${requestId}] Amount: ${amount}, Items: ${orderItems.length}`);
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: orderItems.map((item) => ({
        price_data: {
          currency: currency,
          product_data: {
            name: `Product ${item.id}`,
            description: `Quantity: ${item.quantity}`,
          },
          unit_amount: Math.round(item.price || amount / orderItems.length),
        },
        quantity: item.quantity || 1,
      })),
      mode: 'payment',
      success_url: 'https://thegrandgaia.com/checkout/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://thegrandgaia.com/cart',
      metadata: {
        ...metadata,
        orderItems: JSON.stringify(orderItems),
        orderTotal: amount.toString(),
        requestId
      },
      customer_email: metadata.email || undefined,
    });
    
    console.log(`[${requestId}] Checkout session created: ${session.id}`);
    
    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error(`[${requestId}] Checkout session creation failed:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to create checkout session',
      message: error.message,
      details: {
        type: error.type,
        code: error.code,
        statusCode: error.statusCode
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Retrieve Payment Intent
router.get('/payment-intent/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const paymentIntent = await stripe.paymentIntents.retrieve(id);
    
    res.json({
      success: true,
      paymentIntent,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Failed to retrieve payment intent:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve payment intent',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Retrieve Checkout Session
router.get('/checkout-session/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const session = await stripe.checkout.sessions.retrieve(id);
    
    res.json({
      success: true,
      session,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Failed to retrieve checkout session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve checkout session',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;