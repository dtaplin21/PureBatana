import express from 'express';
import Stripe from 'stripe';
import { db } from './db';
import { products, users, orders, reviews, cartItems } from '../shared/schema';
import { eq, and, count } from 'drizzle-orm';

const router = express.Router();

// Initialize Stripe with environment variable
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set");
}
console.log("Using Stripe key from environment variables");
const stripe = new Stripe(stripeSecretKey);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all products
router.get('/products', async (req, res) => {
  try {
    const allProducts = await db.select().from(products);
    res.json(allProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID or slug (handles both cases)
router.get('/products/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Check if slug is a number (ID) or string (slug)
    if (!isNaN(parseInt(slug))) {
      // It's an ID, use the ID route
      const product = await db.select().from(products).where(eq(products.id, parseInt(slug)));
      
      if (product.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      return res.json(product[0]);
    } else {
      // It's a slug, use slug lookup
      const product = await db.select().from(products).where(eq(products.slug, slug));
      
      if (product.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      return res.json(product[0]);
    }
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product
router.post('/products', async (req, res) => {
  try {
    const productData = req.body;
    const newProduct = await db.insert(products).values(productData).returning();
    res.status(201).json(newProduct[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedProduct = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, parseInt(id)))
      .returning();
    
    if (updatedProduct.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(updatedProduct[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.delete(products).where(eq(products.id, parseInt(id)));
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const allUsers = await db.select().from(users);
    res.json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.select().from(users).where(eq(users.id, parseInt(id)));
    
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create user
router.post('/users', async (req, res) => {
  try {
    const userData = req.body;
    const newUser = await db.insert(users).values(userData).returning();
    res.status(201).json(newUser[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedUser = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, parseInt(id)))
      .returning();
    
    if (updatedUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(updatedUser[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.delete(users).where(eq(users.id, parseInt(id)));
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const allOrders = await db.select().from(orders);
    res.json(allOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get orders by user ID
router.get('/users/:userId/orders', async (req, res) => {
  try {
    const { userId } = req.params;
    const userOrders = await db.select().from(orders).where(eq(orders.userId, parseInt(userId)));
    res.json(userOrders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
});

// Create order
router.post('/orders', async (req, res) => {
  try {
    const orderData = req.body;
    const newOrder = await db.insert(orders).values(orderData).returning();
    res.status(201).json(newOrder[0]);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update order
router.put('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedOrder = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, parseInt(id)))
      .returning();
    
    if (updatedOrder.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(updatedOrder[0]);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Delete order
router.delete('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.delete(orders).where(eq(orders.id, parseInt(id)));
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// Get all reviews
router.get('/reviews', async (req, res) => {
  try {
    const allReviews = await db.select().from(reviews);
    res.json(allReviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Get reviews by product ID
router.get('/products/:productId/reviews', async (req, res) => {
  try {
    const { productId } = req.params;
    const productReviews = await db.select().from(reviews).where(eq(reviews.productId, parseInt(productId)));
    res.json(productReviews);
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    res.status(500).json({ error: 'Failed to fetch product reviews' });
  }
});

// Create review
router.post('/reviews', async (req, res) => {
  try {
    const reviewData = req.body;
    const newReview = await db.insert(reviews).values(reviewData).returning();
    res.status(201).json(newReview[0]);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Update review
router.put('/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedReview = await db
      .update(reviews)
      .set(updateData)
      .where(eq(reviews.id, parseInt(id)))
      .returning();
    
    if (updatedReview.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    res.json(updatedReview[0]);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// Delete review
router.delete('/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.delete(reviews).where(eq(reviews.id, parseInt(id)));
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// Get cart items by user ID
router.get('/users/:userId/cart', async (req, res) => {
  try {
    const { userId } = req.params;
    const userCart = await db.select().from(cartItems).where(eq(cartItems.userId, parseInt(userId)));
    res.json(userCart);
  } catch (error) {
    console.error('Error fetching user cart:', error);
    res.status(500).json({ error: 'Failed to fetch user cart' });
  }
});

// Add item to cart
router.post('/cart', async (req, res) => {
  try {
    const cartItemData = req.body;
    const newCartItem = await db.insert(cartItems).values(cartItemData).returning();
    res.status(201).json(newCartItem[0]);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Update cart item
router.put('/cart/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedCartItem = await db
      .update(cartItems)
      .set(updateData)
      .where(eq(cartItems.id, parseInt(id)))
      .returning();
    
    if (updatedCartItem.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    
    res.json(updatedCartItem[0]);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

// Delete cart item
router.delete('/cart/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.delete(cartItems).where(eq(cartItems.id, parseInt(id)));
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    
    res.json({ message: 'Cart item deleted successfully' });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({ error: 'Failed to delete cart item' });
  }
});

// Clear user cart
router.delete('/users/:userId/cart', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await db.delete(cartItems).where(eq(cartItems.userId, parseInt(userId)));
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'No cart items found for user' });
    }
    
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// Create payment intent for embedded checkout
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, orderItems = [], metadata = {} } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    console.log('Creating payment intent:', { amount, orderItems, metadata });

    // Create payment intent with order details
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
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

    console.log('Payment intent created:', paymentIntent.id);

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create payment intent',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
});

// Stripe checkout session creation
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Invalid items data' });
    }

    // Fetch product details for the items
    const productIds = items.map((item: any) => item.id);
    const productsData = await db.select().from(products).where(eq(products.id, productIds[0]));
    
    if (productsData.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            images: product.images,
          },
          unit_amount: Math.round(product.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${req.headers.origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cart`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Get order details by session ID
router.get('/order-details', async (req, res) => {
  try {
    const { session_id } = req.query;
    
    if (!session_id) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id as string);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // You can enhance this to fetch order details from your database
    // based on the session metadata or customer information
    const orderDetails = {
      orderId: session.id,
      total: session.amount_total ? session.amount_total / 100 : 0, // Convert from cents
      status: session.payment_status,
      customerEmail: session.customer_details?.email,
    };

    res.json(orderDetails);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});

export default router;

export function registerRoutes(app: any) {
  app.use('/api', router);
  return app;
}
