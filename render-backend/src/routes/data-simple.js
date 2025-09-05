import express from 'express';

const router = express.Router();

// Mock data
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
  },
  {
    id: 2,
    name: "Batana Oil Travel Size",
    slug: "batana-oil-travel",
    description: "Travel-friendly 2oz Batana oil",
    price: "12.95",
    imageUrl: "/images/batana-topview.jpg",
    inStock: true,
    reviewCount: 8,
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
  },
  {
    id: 2,
    userId: 2,
    productId: 1,
    rating: 4,
    comment: "Great product, fast shipping!",
    createdAt: "2024-01-20T14:45:00Z",
    user: {
      firstName: "Mike",
      lastName: "Smith"
    }
  },
  {
    id: 3,
    userId: 3,
    productId: 2,
    rating: 5,
    comment: "Perfect for travel!",
    createdAt: "2024-01-25T09:15:00Z",
    user: {
      firstName: "Emma",
      lastName: "Davis"
    }
  }
];

const mockOrders = [
  {
    id: 1,
    userId: 1,
    stripeSessionId: "cs_test_123",
    totalAmount: "29.95",
    status: "completed",
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    userId: 2,
    stripeSessionId: "cs_test_456",
    totalAmount: "42.90",
    status: "pending",
    createdAt: "2024-01-20T14:45:00Z"
  }
];

// Get all products
router.get('/products', async (req, res) => {
  try {
    console.log('📦 Fetching all products (simplified)...');
    res.json({
      success: true,
      data: mockProducts
    });
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      details: error.message
    });
  }
});

// Get product by slug
router.get('/products/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    console.log(`📦 Fetching product with slug: ${slug} (simplified)...`);
    
    const product = mockProducts.find(p => p.slug === slug);
    
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
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
      details: error.message
    });
  }
});

// Get all reviews
router.get('/reviews', async (req, res) => {
  try {
    console.log('💬 Fetching all reviews (simplified)...');
    res.json({
      success: true,
      data: mockReviews
    });
  } catch (error) {
    console.error('❌ Error fetching reviews:', error);
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
    console.log(`💬 Fetching reviews for product ID: ${productId} (simplified)...`);
    
    const productReviews = mockReviews.filter(r => r.productId === parseInt(productId));
    
    res.json({
      success: true,
      data: productReviews
    });
  } catch (error) {
    console.error('❌ Error fetching product reviews:', error);
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
    console.log('💬 Adding new review (simplified):', { userId, productId, rating, comment });
    
    const newReview = {
      id: mockReviews.length + 1,
      userId: parseInt(userId),
      productId: parseInt(productId),
      rating: parseInt(rating),
      comment: comment,
      createdAt: new Date().toISOString(),
      user: {
        firstName: "Test",
        lastName: "User"
      }
    };
    
    mockReviews.push(newReview);
    
    res.json({
      success: true,
      data: newReview
    });
  } catch (error) {
    console.error('❌ Error adding review:', error);
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
    console.log(`💬 Deleting review ${reviewId} for user ${userId} (simplified)...`);
    
    const reviewIndex = mockReviews.findIndex(r => r.id === parseInt(reviewId) && r.userId === parseInt(userId));
    
    if (reviewIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Review not found or not authorized'
      });
    }
    
    const deletedReview = mockReviews.splice(reviewIndex, 1)[0];
    
    res.json({
      success: true,
      data: deletedReview
    });
  } catch (error) {
    console.error('❌ Error deleting review:', error);
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
    console.log('📋 Fetching orders (simplified)...');
    res.json({
      success: true,
      data: mockOrders
    });
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders',
      details: error.message
    });
  }
});

// Cart operations (client-side handled)
router.post('/cart/add', async (req, res) => {
  console.log('🛒 Cart add operation (simplified)');
  res.json({
    success: true,
    message: 'Cart operation handled client-side'
  });
});

router.delete('/cart/remove', async (req, res) => {
  console.log('🛒 Cart remove operation (simplified)');
  res.json({
    success: true,
    message: 'Cart operation handled client-side'
  });
});

router.delete('/cart/clear', async (req, res) => {
  console.log('🛒 Cart clear operation (simplified)');
  res.json({
    success: true,
    message: 'Cart operation handled client-side'
  });
});

export default router;
