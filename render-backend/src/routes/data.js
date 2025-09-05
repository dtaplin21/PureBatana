import express from 'express';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, desc, and, sql } from 'drizzle-orm';
import { products, reviews, orders } from '../schema.js';

const router = express.Router();

// Database connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.warn('⚠️ DATABASE_URL not found, using mock data');
}

let client, db;

if (connectionString) {
  try {
    client = postgres(connectionString, {
      ssl: 'require',
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    db = drizzle(client);
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.warn('⚠️ Falling back to mock data');
    client = null;
    db = null;
  }
} else {
  console.warn('⚠️ No DATABASE_URL provided, using mock data');
  client = null;
  db = null;
}

// Mock data fallback
const mockProducts = [
  {
    id: 1,
    name: "Pure Batana Oil",
    slug: "pure-batana-oil",
    description: "Premium 100% pure Batana oil for hair and skin care",
    price: "29.95",
    imageUrl: "/images/batana-front.jpg",
    inStock: true,
    reviewCount: 15,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
];

const mockReviews = [
  {
    id: 1,
    userId: 1,
    productId: 1,
    rating: 5,
    comment: "Amazing oil! My hair has never looked better.",
    createdAt: "2024-01-15T10:30:00Z",
    user: {
      firstName: "Sarah",
      lastName: "Johnson"
    }
  }
];

// Get all products
router.get('/products', async (req, res) => {
  try {
    console.log('📦 Fetching all products...');
    
    if (!db) {
      console.log('📦 Using mock data (no database connection)');
      return res.json({
        success: true,
        data: mockProducts
      });
    }
    
    const allProducts = await db.select().from(products);
    
    // Add review count to each product
    const productsWithReviewCount = await Promise.all(
      allProducts.map(async (product) => {
        const reviewCount = await db
          .select({ count: sql`count(*)` })
          .from(reviews)
          .where(eq(reviews.productId, product.id));
        
        return {
          ...product,
          reviewCount: reviewCount[0]?.count || 0
        };
      })
    );
    
    res.json({
      success: true,
      data: productsWithReviewCount
    });
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    console.log('📦 Falling back to mock data');
    res.json({
      success: true,
      data: mockProducts
    });
  }
});

// Get product by slug
router.get('/products/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    console.log(`📦 Fetching product with slug: ${slug}`);
    
    if (!db) {
      console.log('📦 Using mock data (no database connection)');
      const product = mockProducts.find(p => p.slug === slug);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }
      return res.json({
        success: true,
        data: product
      });
    }
    
    const product = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);
    
    if (product.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    // Add review count
    const reviewCount = await db
      .select({ count: sql`count(*)` })
      .from(reviews)
      .where(eq(reviews.productId, product[0].id));
    
    const productWithReviewCount = {
      ...product[0],
      reviewCount: reviewCount[0]?.count || 0
    };
    
    res.json({
      success: true,
      data: productWithReviewCount
    });
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    console.log('📦 Falling back to mock data');
    const product = mockProducts.find(p => p.slug === req.params.slug);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    res.json({
      success: true,
      data: product
    });
  }
});

// Get all reviews
router.get('/reviews', async (req, res) => {
  try {
    console.log('Fetching all reviews...');
    const allReviews = await db
      .select({
        id: reviews.id,
        userId: reviews.userId,
        productId: reviews.productId,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        user: {
          firstName: sql`users.first_name`,
          lastName: sql`users.last_name`
        }
      })
      .from(reviews)
      .leftJoin(sql`users`, eq(reviews.userId, sql`users.id`))
      .orderBy(desc(reviews.createdAt));
    
    res.json({
      success: true,
      data: allReviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews',
      details: error.message
    });
  }
});

// Get reviews by product ID
router.get('/reviews/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    console.log(`Fetching reviews for product ID: ${productId}`);
    
    const productReviews = await db
      .select({
        id: reviews.id,
        userId: reviews.userId,
        productId: reviews.productId,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        user: {
          firstName: sql`users.first_name`,
          lastName: sql`users.last_name`
        }
      })
      .from(reviews)
      .leftJoin(sql`users`, eq(reviews.userId, sql`users.id`))
      .where(eq(reviews.productId, parseInt(productId)))
      .orderBy(desc(reviews.createdAt));
    
    res.json({
      success: true,
      data: productReviews
    });
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product reviews',
      details: error.message
    });
  }
});

// Add review
router.post('/reviews', async (req, res) => {
  try {
    const { userId, productId, rating, comment } = req.body;
    console.log('Adding new review:', { userId, productId, rating, comment });
    
    const newReview = await db
      .insert(reviews)
      .values({
        userId: parseInt(userId),
        productId: parseInt(productId),
        rating: parseInt(rating),
        comment: comment,
        createdAt: new Date()
      })
      .returning();
    
    res.json({
      success: true,
      data: newReview[0]
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add review',
      details: error.message
    });
  }
});

// Delete review
router.delete('/reviews/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId } = req.body;
    console.log(`Deleting review ${reviewId} for user ${userId}`);
    
    const deletedReview = await db
      .delete(reviews)
      .where(and(
        eq(reviews.id, parseInt(reviewId)),
        eq(reviews.userId, parseInt(userId))
      ))
      .returning();
    
    if (deletedReview.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Review not found or not authorized'
      });
    }
    
    res.json({
      success: true,
      data: deletedReview[0]
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete review',
      details: error.message
    });
  }
});

// Get orders
router.get('/orders', async (req, res) => {
  try {
    console.log('Fetching orders...');
    const allOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt));
    
    res.json({
      success: true,
      data: allOrders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders',
      details: error.message
    });
  }
});

// Cart operations (these are typically handled client-side, but we can add them for consistency)
router.post('/cart/add', async (req, res) => {
  // Cart is typically handled client-side, but we can acknowledge the request
  res.json({
    success: true,
    message: 'Cart operation handled client-side'
  });
});

router.delete('/cart/remove', async (req, res) => {
  // Cart is typically handled client-side, but we can acknowledge the request
  res.json({
    success: true,
    message: 'Cart operation handled client-side'
  });
});

router.delete('/cart/clear', async (req, res) => {
  // Cart is typically handled client-side, but we can acknowledge the request
  res.json({
    success: true,
    message: 'Cart operation handled client-side'
  });
});

export default router;
