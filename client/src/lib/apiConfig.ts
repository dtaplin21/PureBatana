// API Configuration for Render Backend
const RENDER_API_URL = import.meta.env.VITE_RENDER_API_URL || 'http://localhost:3001';
const VERCEL_API_URL = window.location.origin;

export const API_ENDPOINTS = {
  // Stripe endpoints (Render backend)
  STRIPE: {
    TEST: `${RENDER_API_URL}/api/stripe/test`,
    CREATE_PAYMENT_INTENT: `${RENDER_API_URL}/api/stripe/create-payment-intent`,
    CREATE_CHECKOUT_SESSION: `${RENDER_API_URL}/api/stripe/create-checkout-session`,
    GET_PAYMENT_INTENT: (id: string) => `${RENDER_API_URL}/api/stripe/payment-intent/${id}`,
    GET_CHECKOUT_SESSION: (id: string) => `${RENDER_API_URL}/api/stripe/checkout-session/${id}`,
  },
  
  // Vercel endpoints (existing)
  VERCEL: {
    PRODUCTS: `${VERCEL_API_URL}/api/products`,
    PRODUCT_BY_SLUG: (slug: string) => `${VERCEL_API_URL}/api/products/${slug}`,
    REVIEWS: `${VERCEL_API_URL}/api/reviews`,
    REVIEWS_BY_PRODUCT: (productId: number) => `${VERCEL_API_URL}/api/reviews/product/${productId}`,
    CART_ADD: `${VERCEL_API_URL}/api/cart/add`,
    CART_REMOVE: `${VERCEL_API_URL}/api/cart/remove`,
    CART_CLEAR: `${VERCEL_API_URL}/api/cart/clear`,
    ORDERS: `${VERCEL_API_URL}/api/orders`,
  }
};

// Helper function to get the correct API URL based on endpoint type
export const getApiUrl = (endpoint: string) => {
  // If it's already a full URL, return as is
  if (endpoint.startsWith('http')) {
    return endpoint;
  }
  
  // Normalize the endpoint to start with /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Check if it's a Stripe/payment endpoint
  if (normalizedEndpoint.includes('create-payment-intent')) {
    return API_ENDPOINTS.STRIPE.CREATE_PAYMENT_INTENT;
  }
  if (normalizedEndpoint.includes('create-checkout-session')) {
    return API_ENDPOINTS.STRIPE.CREATE_CHECKOUT_SESSION;
  }
  if (normalizedEndpoint.includes('stripe')) {
    return API_ENDPOINTS.STRIPE.TEST;
  }
  
  // Handle specific Vercel endpoints
  if (normalizedEndpoint === '/api/products') {
    return API_ENDPOINTS.VERCEL.PRODUCTS;
  }
  if (normalizedEndpoint.startsWith('/api/products/') && normalizedEndpoint !== '/api/products') {
    const slug = normalizedEndpoint.replace('/api/products/', '');
    return API_ENDPOINTS.VERCEL.PRODUCT_BY_SLUG(slug);
  }
  if (normalizedEndpoint === '/api/reviews') {
    return API_ENDPOINTS.VERCEL.REVIEWS;
  }
  if (normalizedEndpoint.startsWith('/api/reviews/product/')) {
    const productId = parseInt(normalizedEndpoint.replace('/api/reviews/product/', ''));
    return API_ENDPOINTS.VERCEL.REVIEWS_BY_PRODUCT(productId);
  }
  if (normalizedEndpoint === '/api/cart/add') {
    return API_ENDPOINTS.VERCEL.CART_ADD;
  }
  if (normalizedEndpoint === '/api/cart/remove') {
    return API_ENDPOINTS.VERCEL.CART_REMOVE;
  }
  if (normalizedEndpoint === '/api/cart/clear') {
    return API_ENDPOINTS.VERCEL.CART_CLEAR;
  }
  if (normalizedEndpoint.startsWith('/api/orders')) {
    return API_ENDPOINTS.VERCEL.ORDERS;
  }
  
  // Default to Vercel for any other endpoints
  return `${VERCEL_API_URL}${normalizedEndpoint}`;
};

// Environment configuration
export const API_CONFIG = {
  RENDER_BASE_URL: RENDER_API_URL,
  VERCEL_BASE_URL: VERCEL_API_URL,
  USE_RENDER_FOR_PAYMENTS: import.meta.env.VITE_USE_RENDER_PAYMENTS !== 'false', // Default to true
};
