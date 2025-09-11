import express from 'express';
import stripe from '../config/stripe.js';
import { sendAdminOrderNotification, sendOrderConfirmationEmail } from '../../lib/email.js';

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

// Stripe Webhook Endpoint
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  
  try {
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not set');
      return res.status(400).json({ error: 'Webhook secret not configured' });
    }
    
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    console.log(`Received webhook event: ${event.type}`);
    
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).json({ error: 'Invalid signature' });
  }
  
  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log(`Processing completed checkout session: ${session.id}`);
    
    try {
      // Extract order information from session metadata
      const metadata = session.metadata || {};
      const orderItems = JSON.parse(metadata.orderItems || '[]');
      const orderTotal = parseFloat(metadata.orderTotal || '0');
      
      // Create order data for email notifications
      const orderData = {
        orderNumber: session.id.substring(0, 8).toUpperCase(), // Use first 8 chars of session ID
        customerName: metadata.customerName || session.customer_details?.name || 'Customer',
        customerEmail: session.customer_details?.email || metadata.email || 'unknown@example.com',
        items: orderItems.map(item => ({
          name: `Product ${item.id}`,
          quantity: item.quantity || 1,
          price: (item.price || 0) / 100 // Convert cents to dollars
        })),
        subtotal: orderTotal - 5.99, // Subtract shipping
        shipping: 5.99,
        total: orderTotal,
        shippingAddress: [
          session.customer_details?.address?.line1 || '',
          session.customer_details?.address?.line2 || '',
          session.customer_details?.address?.city || '',
          session.customer_details?.address?.state || '',
          session.customer_details?.address?.postal_code || '',
          session.customer_details?.address?.country || ''
        ].filter(Boolean).join(', '),
        dateCreated: new Date()
      };
      
      console.log('Order data prepared:', orderData);
      
      // Send admin notification email
      const adminEmailSent = await sendAdminOrderNotification(orderData);
      console.log(`Admin notification email sent: ${adminEmailSent}`);
      
      // Send customer confirmation email
      const customerEmailSent = await sendOrderConfirmationEmail(orderData);
      console.log(`Customer confirmation email sent: ${customerEmailSent}`);
      
      // Log the successful order processing
      console.log(`✅ Order processed successfully: ${orderData.orderNumber}`);
      
    } catch (error) {
      console.error('Error processing checkout session:', error);
      // Don't return error to Stripe - we'll log it but acknowledge receipt
    }
  }
  
  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
});

export default router;