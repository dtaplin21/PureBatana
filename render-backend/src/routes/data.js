import express from 'express';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, desc, and, sql } from 'drizzle-orm';
import { products, reviews, orders } from '../schema.js';

const router = express.Router();

// Simple in-memory cache (resets on server restart)
let productsCache = null;
let productsCacheTime = 0;
const CACHE_DURATION = 30000; // 30 seconds cache

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
      max: 10, // Increased from 1 to 10 for better concurrency
      idle_timeout: 20,
      connect_timeout: 10, // Increased back to 10 seconds for stability
      prepare: true, // Enable prepared statements for better performance
      debug: false, // Disable debug logging for production
      transform: {
        undefined: null, // Transform undefined to null for better DB compatibility
      },
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
    price: 29.95, // Fallback price if database is unavailable
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
    
    // Check cache first
    const now = Date.now();
    if (productsCache && (now - productsCacheTime) < CACHE_DURATION) {
      console.log('📦 Using cached products data');
      return res.json({
        success: true,
        data: productsCache
      });
    }
    
    if (!client) {
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
    
    // Use a single JOIN query to get products with review counts (fixes N+1 query problem)
    // Add timeout and optimize query
    const allProducts = await client`
      SELECT 
        p.*,
        COALESCE(r.review_count, 0) as review_count
      FROM products p
      LEFT JOIN (
        SELECT product_id, COUNT(*) as review_count
        FROM reviews
        GROUP BY product_id
      ) r ON p.id = r.product_id
      ORDER BY p.id
    `.timeout(5000); // 5 second timeout
    
    // Transform products to match frontend Product type
    const productsWithReviewCount = allProducts.map((product) => {
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.short_description || product.description.substring(0, 100) + '...',
        price: parseFloat(product.price), // Convert to number
        images: product.images || [product.image_url || '/images/batana-front.jpg'],
        category: product.category || 'skincare',
        stock: product.stock || (product.in_stock ? 100 : 0),
        featured: product.featured || false,
        benefits: product.benefits || [
          '100% Pure and Natural',
          'Cold-Pressed Extraction',
          'Rich in Essential Fatty Acids',
          'Moisturizes and Nourishes'
        ],
        usage: product.usage || 'Apply a few drops to clean skin or hair. Massage gently until absorbed.',
        isBestseller: product.is_bestseller || false,
        isNew: product.is_new || false,
        viewCount: product.view_count || 0,
        reviewCount: parseInt(product.review_count || 0)
      };
    });
    
    // Cache the result
    productsCache = productsWithReviewCount;
    productsCacheTime = Date.now();
    
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
    
    // Try database first, fall back to mock data if needed
    if (client) {
      try {
        console.log('📦 Fetching from database...');
        const productResult = await client`
          SELECT 
            p.*,
            COALESCE(r.review_count, 0) as review_count
          FROM products p
          LEFT JOIN (
            SELECT product_id, COUNT(*) as review_count
            FROM reviews
            GROUP BY product_id
          ) r ON p.id = r.product_id
          WHERE p.slug = ${slug}
          LIMIT 1
        `.timeout(5000); // 5 second timeout
        
        if (productResult.length > 0) {
          const product = productResult[0];
          const productWithReviewCount = {
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            shortDescription: product.short_description || product.description.substring(0, 100) + '...',
            price: parseFloat(product.price), // Convert to number
            images: product.images || [product.image_url || '/images/batana-front.jpg'],
            category: product.category || 'skincare',
            stock: product.stock || (product.in_stock ? 100 : 0),
            featured: product.featured || false,
            benefits: product.benefits || [
              '100% Pure and Natural',
              'Cold-Pressed Extraction',
              'Rich in Essential Fatty Acids',
              'Moisturizes and Nourishes'
            ],
            usage: product.usage || 'Apply a few drops to clean skin or hair. Massage gently until absorbed.',
            isBestseller: product.is_bestseller || false,
            isNew: product.is_new || false,
            viewCount: product.view_count || 0,
            reviewCount: parseInt(product.review_count || 0)
          };
          
          console.log(`✅ Found product in database: ${product.name} - $${product.price/100}`);
          return res.json({
            success: true,
            data: productWithReviewCount
          });
        }
      } catch (dbError) {
        console.error('❌ Database query failed:', dbError.message);
        console.log('📦 Falling back to mock data');
      }
    }
    
    // Fall back to mock data
    console.log('📦 Using mock data (database unavailable)');
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
    
    // Database logic commented out temporarily - using mock data for now
    /*
    if (!db) {
      // Database connection logic here
    }
    
    // Try to get product from database first
    try {
      const productResult = await client`
        SELECT 
          p.*,
          COALESCE(r.review_count, 0) as review_count
        FROM products p
        LEFT JOIN (
          SELECT product_id, COUNT(*) as review_count
          FROM reviews
          GROUP BY product_id
        ) r ON p.id = r.product_id
        WHERE p.slug = ${slug}
        LIMIT 1
      `;
      
      if (productResult.length > 0) {
        const product = productResult[0];
        const productWithReviewCount = {
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          shortDescription: product.short_description || product.description.substring(0, 100) + '...',
          price: parseFloat(product.price), // Convert to number
          images: product.images || [product.image_url || '/images/batana-front.jpg'],
          category: product.category || 'skincare',
          stock: product.stock || (product.in_stock ? 100 : 0),
          featured: product.featured || false,
          benefits: product.benefits || [
            '100% Pure and Natural',
            'Cold-Pressed Extraction',
            'Rich in Essential Fatty Acids',
            'Moisturizes and Nourishes'
          ],
          usage: product.usage || 'Apply a few drops to clean skin or hair. Massage gently until absorbed.',
          isBestseller: product.is_bestseller || false,
          isNew: product.is_new || false,
          viewCount: product.view_count || 0,
          reviewCount: parseInt(product.review_count || 0)
        };
        
        return res.json({
          success: true,
          data: productWithReviewCount
        });
      }
    } catch (dbError) {
      console.error('Database query failed, falling back to mock data:', dbError.message);
    }
    */
    
    // Fall back to mock data (current implementation)
    const mockProduct = mockProducts.find(p => p.slug === slug);
    if (!mockProduct) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    const productWithReviewCount = {
      id: mockProduct.id,
      name: mockProduct.name,
      slug: mockProduct.slug,
      description: mockProduct.description,
      shortDescription: mockProduct.description.substring(0, 100) + '...',
      price: parseFloat(mockProduct.price), // Convert to number
      images: [mockProduct.imageUrl || '/images/batana-front.jpg'],
      category: 'skincare',
      stock: mockProduct.inStock ? 100 : 0,
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
      reviewCount: mockProduct.reviewCount || 0
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
    
    // For now, return empty array since no orders exist yet
    // This will prevent the admin panel from crashing
    res.json({
      success: true,
      data: []
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

// Update product price (admin endpoint) - Quick Fix Version
router.put('/products/:id/price', async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;
    
    console.log(`📝 Price update request - Product ID: ${id}, Price: ${price}`);
    
    if (!price || isNaN(price)) {
      return res.status(400).json({
        success: false,
        error: 'Valid price is required'
      });
    }
    
    // Quick fix: Use raw SQL with error handling for different schema types
    try {
      // Try integer update first (cents) using postgres connection
      const result = await client`
        UPDATE products 
        SET price = ${Math.round(price)}, updated_at = NOW()
        WHERE id = ${parseInt(id)}
        RETURNING *
      `;
      
      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }
      
      console.log(`✅ Price updated successfully - Product ${id} price set to ${result[0].price}`);
      
      // Invalidate cache when price is updated
      productsCache = null;
      productsCacheTime = 0;
      console.log('🗑️ Products cache invalidated');
      
      res.json({
        success: true,
        data: result[0]
      });
      
    } catch (dbError) {
      console.log('⚠️  Integer update failed, trying decimal update:', dbError.message);
      
      // Fallback: Try decimal update (dollars)
      const result = await client`
        UPDATE products 
        SET price = ${Math.round(price) / 100}, updated_at = NOW()
        WHERE id = ${parseInt(id)}
        RETURNING *
      `;
      
      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }
      
      console.log(`✅ Price updated successfully (decimal) - Product ${id} price set to ${result[0].price}`);
      
      res.json({
        success: true,
        data: result[0]
      });
    }
    
  } catch (error) {
    console.error('Error updating product price:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update product price',
      details: error.message
    });
  }
});

// Simple test endpoint for price updates
router.put('/test-price-update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;
    
    console.log(`🧪 Test price update - Product ID: ${id}, Price: ${price}`);
    console.log('Client available:', !!client);
    console.log('Database URL available:', !!connectionString);
    
    if (!client) {
      return res.status(500).json({
        success: false,
        error: 'Database client not available'
      });
    }
    
    // Simple test update
    const result = await client`
      UPDATE products 
      SET price = ${Math.round(price)}
      WHERE id = ${parseInt(id)}
      RETURNING id, name, price
    `;
    
    res.json({
      success: true,
      data: result[0],
      message: 'Test update successful'
    });
    
  } catch (error) {
    console.error('❌ Test update error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

export default router;
