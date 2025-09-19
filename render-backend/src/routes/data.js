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
    price: 29.95,
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
      // Transform mock data to match frontend Product type
      const transformedMockProducts = mockProducts.map(product => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.description.substring(0, 100) + '...',
        price: parseFloat(product.price), // Convert string to number
        images: [product.imageUrl || '/images/batana-front.jpg'],
        category: 'skincare',
        stock: product.inStock ? 100 : 0,
        featured: false,
        benefits: [
          '100% Pure and Natural',
          'Cold-Pressed Extraction',
          'Rich in Essential Fatty Acids',
          'Moisturizes and Nourishes'
        ],
        usage: 'Apply a few drops to clean skin or hair. Massage gently until absorbed.',
        isBestseller: false,
        isNew: true,
        viewCount: 0,
        reviewCount: product.reviewCount || 0
      }));
      
      return res.json({
        success: true,
        data: transformedMockProducts
      });
    }
    
    const allProducts = await db.select().from(products);
    
    // Add review count to each product and transform to match frontend Product type
    const productsWithReviewCount = await Promise.all(
      allProducts.map(async (product) => {
        const reviewCount = await db
          .select({ count: sql`count(*)` })
          .from(reviews)
          .where(eq(reviews.productId, product.id));
        
        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          shortDescription: product.shortDescription || product.description.substring(0, 100) + '...',
          price: parseFloat(product.price), // Convert decimal to number
          images: product.images || [product.imageUrl || '/images/batana-front.jpg'],
          category: product.category || 'skincare',
          stock: product.stock || (product.inStock ? 100 : 0),
          featured: product.featured || false,
          benefits: product.benefits || [
            '100% Pure and Natural',
            'Cold-Pressed Extraction',
            'Rich in Essential Fatty Acids',
            'Moisturizes and Nourishes'
          ],
          usage: product.usage || 'Apply a few drops to clean skin or hair. Massage gently until absorbed.',
          isBestseller: product.isBestseller || false,
          isNew: product.isNew || false,
          viewCount: product.viewCount || 0,
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
    
    // Transform mock data to match frontend Product type
    const transformedMockProducts = mockProducts.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.description.substring(0, 100) + '...',
      price: parseFloat(product.price), // Convert string to number
      images: [product.imageUrl || '/images/batana-front.jpg'],
      category: 'skincare',
      stock: product.inStock ? 100 : 0,
      featured: false,
      benefits: [
        '100% Pure and Natural',
        'Cold-Pressed Extraction',
        'Rich in Essential Fatty Acids',
        'Moisturizes and Nourishes'
      ],
      usage: 'Apply a few drops to clean skin or hair. Massage gently until absorbed.',
      isBestseller: false,
      isNew: true,
      viewCount: 0,
      reviewCount: product.reviewCount || 0
    }));
    
    res.json({
      success: true,
      data: transformedMockProducts
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
      
      // Transform mock data to match frontend Product type
      const transformedProduct = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.description.substring(0, 100) + '...',
        price: parseFloat(product.price), // Convert string to number
        images: [product.imageUrl || '/images/batana-front.jpg'],
        category: 'skincare',
        stock: product.inStock ? 100 : 0,
        featured: false,
        benefits: [
          '100% Pure and Natural',
          'Cold-Pressed Extraction',
          'Rich in Essential Fatty Acids',
          'Moisturizes and Nourishes'
        ],
        usage: 'Apply a few drops to clean skin or hair. Massage gently until absorbed.',
        isBestseller: false,
        isNew: true,
        viewCount: 0,
        reviewCount: product.reviewCount || 0
      };
      
      return res.json({
        success: true,
        data: transformedProduct
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
      id: product[0].id,
      name: product[0].name,
      slug: product[0].slug,
      description: product[0].description,
      shortDescription: product[0].shortDescription || product[0].description.substring(0, 100) + '...',
      price: parseFloat(product[0].price), // Convert decimal to number
      images: product[0].images || [product[0].imageUrl || '/images/batana-front.jpg'],
      category: product[0].category || 'skincare',
      stock: product[0].stock || (product[0].inStock ? 100 : 0),
      featured: product[0].featured || false,
      benefits: product[0].benefits || [
        '100% Pure and Natural',
        'Cold-Pressed Extraction',
        'Rich in Essential Fatty Acids',
        'Moisturizes and Nourishes'
      ],
      usage: product[0].usage || 'Apply a few drops to clean skin or hair. Massage gently until absorbed.',
      isBestseller: product[0].isBestseller || false,
      isNew: product[0].isNew || false,
      viewCount: product[0].viewCount || 0,
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
    
    // Transform mock data to match frontend Product type
    const transformedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.description.substring(0, 100) + '...',
      price: parseFloat(product.price), // Convert string to number
      images: [product.imageUrl || '/images/batana-front.jpg'],
      category: 'skincare',
      stock: product.inStock ? 100 : 0,
      featured: false,
      benefits: [
        '100% Pure and Natural',
        'Cold-Pressed Extraction',
        'Rich in Essential Fatty Acids',
        'Moisturizes and Nourishes'
      ],
      usage: 'Apply a few drops to clean skin or hair. Massage gently until absorbed.',
      isBestseller: false,
      isNew: true,
      viewCount: 0,
      reviewCount: product.reviewCount || 0
    };
    
    res.json({
      success: true,
      data: transformedProduct
    });
  }
});

// Get all reviews
router.get('/reviews', async (req, res) => {
  try {
    console.log('📝 Fetching all reviews...');
    
    if (!db) {
      console.log('📝 Using mock data (no database connection)');
      return res.json({
        success: true,
        data: mockReviews
      });
    }
    
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
    console.error('❌ Error fetching reviews:', error);
    console.log('📝 Falling back to mock data');
    res.json({
      success: true,
      data: mockReviews
    });
  }
});

// Get reviews by product ID
router.get('/reviews/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    console.log(`📝 Fetching reviews for product ID: ${productId}`);
    
    if (!db) {
      console.log('📝 Using mock data (no database connection)');
      const productReviews = mockReviews.filter(review => review.productId === parseInt(productId));
      return res.json({
        success: true,
        data: productReviews
      });
    }
    
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
    console.error('❌ Error fetching product reviews:', error);
    console.log('📝 Falling back to mock data');
    const productReviews = mockReviews.filter(review => review.productId === parseInt(req.params.productId));
    res.json({
      success: true,
      data: productReviews
    });
  }
});

// Add review
router.post('/reviews', async (req, res) => {
  try {
    const { productId, rating, comment, customerName } = req.body;
    console.log('Adding new review:', { productId, rating, comment, customerName });
    
    // Validate required fields
    if (!productId || !rating) {
      return res.status(400).json({
        success: false,
        error: 'Product ID and rating are required'
      });
    }
    
    const newReview = await db
      .insert(reviews)
      .values({
        userId: 1, // Default user ID for anonymous reviews
        productId: parseInt(productId),
        rating: parseInt(rating),
        comment: comment || null,
        customerName: customerName || 'Anonymous',
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
    const { userId, isAdmin } = req.body;
    console.log(`Deleting review ${reviewId} for user ${userId}, admin: ${isAdmin}`);
    
    let deletedReview;
    
    if (isAdmin) {
      // Admin can delete any review
      deletedReview = await db
        .delete(reviews)
        .where(eq(reviews.id, parseInt(reviewId)))
        .returning();
    } else {
      // Regular users can only delete their own reviews
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User ID required for review deletion'
        });
      }
      
      console.log(`Attempting to delete review ${reviewId} for user ${userId}`);
      
      // First, check if the review exists and belongs to the user
      const existingReview = await db.select().from(reviews).where(eq(reviews.id, parseInt(reviewId)));
      console.log(`Found review:`, existingReview[0]);
      
      if (existingReview.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Review not found'
        });
      }
      
      if (existingReview[0].userId !== parseInt(userId)) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to delete this review'
        });
      }
      
      deletedReview = await db
        .delete(reviews)
        .where(eq(reviews.id, parseInt(reviewId)))
        .returning();
      console.log(`Delete result: ${deletedReview.length} rows affected`);
    }
    
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
    
    // Use raw SQL to avoid schema conflicts
    const allOrders = await sql(`
      SELECT 
        id,
        user_id as "userId",
        COALESCE(total, total_amount, 0) as total,
        status,
        COALESCE(email, 'unknown@example.com') as email,
        COALESCE(name, 'Unknown Customer') as name,
        shipping_address as "shippingAddress",
        billing_address as "billingAddress",
        stripe_session_id as "stripeSessionId",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM orders 
      ORDER BY created_at DESC
    `);
    
    // Transform the data to match expected format
    const transformedOrders = allOrders.map(order => ({
      id: order.id,
      userId: order.userId,
      total: parseFloat(order.total || 0),
      status: order.status || 'pending',
      email: order.email,
      name: order.name,
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
      stripeSessionId: order.stripeSessionId,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      // Add customer object for admin panel compatibility
      customer: {
        name: order.name,
        email: order.email
      }
    }));
    
    res.json({
      success: true,
      data: transformedOrders
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

// Update product price (admin endpoint)
router.put('/products/:id/price', async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;
    
    if (!price || isNaN(price)) {
      return res.status(400).json({
        success: false,
        error: 'Valid price is required'
      });
    }
    
    const updatedProduct = await db
      .update(products)
      .set({ price: parseInt(price) })
      .where(eq(products.id, parseInt(id)))
      .returning();
    
    if (updatedProduct.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: updatedProduct[0]
    });
  } catch (error) {
    console.error('Error updating product price:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update product price'
    });
  }
});

export default router;
