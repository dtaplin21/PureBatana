// API Configuration for Render Backend
const RENDER_API_URL = import.meta.env.VITE_RENDER_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://purebatana.onrender.com');
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
  
  // Render backend endpoints (production)
  RENDER: {
    PRODUCTS: `${RENDER_API_URL}/api/products`,
    PRODUCT_BY_SLUG: (slug: string) => `${RENDER_API_URL}/api/products/${slug}`,
    REVIEWS: `${RENDER_API_URL}/api/reviews`,
    REVIEWS_BY_PRODUCT: (productId: number) => `${RENDER_API_URL}/api/reviews/product/${productId}`,
    CART_ADD: `${RENDER_API_URL}/api/cart/add`,
    CART_REMOVE: `${RENDER_API_URL}/api/cart/remove`,
    CART_CLEAR: `${RENDER_API_URL}/api/cart/clear`,
    ORDERS: `${RENDER_API_URL}/api/orders`,
  },
  
  // Vercel endpoints (fallback)
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
  
  // ALL OTHER ENDPOINTS NOW GO TO RENDER BACKEND
  // Handle specific Render endpoints
  if (normalizedEndpoint === '/api/products') {
    return `${RENDER_API_URL}/api/products`;
  }
  if (normalizedEndpoint.startsWith('/api/products/') && normalizedEndpoint !== '/api/products') {
    const slug = normalizedEndpoint.replace('/api/products/', '');
    return `${RENDER_API_URL}/api/products/${slug}`;
  }
  if (normalizedEndpoint === '/api/reviews') {
    return `${RENDER_API_URL}/api/reviews`;
  }
  if (normalizedEndpoint.startsWith('/api/reviews/product/')) {
    const productId = normalizedEndpoint.replace('/api/reviews/product/', '');
    return `${RENDER_API_URL}/api/reviews/product/${productId}`;
  }
  if (normalizedEndpoint === '/api/cart/add') {
    return `${RENDER_API_URL}/api/cart/add`;
  }
  if (normalizedEndpoint === '/api/cart/remove') {
    return `${RENDER_API_URL}/api/cart/remove`;
  }
  if (normalizedEndpoint === '/api/cart/clear') {
    return `${RENDER_API_URL}/api/cart/clear`;
  }
  if (normalizedEndpoint.startsWith('/api/orders')) {
    return `${RENDER_API_URL}/api/orders`;
  }
  
  // Default to Render for any other endpoints
  return `${RENDER_API_URL}${normalizedEndpoint}`;
};

// Environment configuration
export const API_CONFIG = {
  RENDER_BASE_URL: RENDER_API_URL,
  VERCEL_BASE_URL: VERCEL_API_URL,
  USE_RENDER_FOR_PAYMENTS: import.meta.env.VITE_USE_RENDER_PAYMENTS !== 'false', // Default to true
};
