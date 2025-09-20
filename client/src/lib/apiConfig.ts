// Environment variable validation
const validateEnvironment = () => {
  const requiredVars = ['VITE_RENDER_API_URL'];
  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0 && window.location.hostname !== 'localhost') {
    console.warn(`Missing environment variables: ${missing.join(', ')}. Using fallback values.`);
  }
};

// Validate environment on load
validateEnvironment();

// Configuration object with fallbacks and environment awareness
const config = {
  renderApiUrl: import.meta.env.VITE_RENDER_API_URL || 
    (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://purebatana.onrender.com'),
  vercelApiUrl: window.location.origin,
  isProduction: window.location.hostname !== 'localhost',
  isDevelopment: window.location.hostname === 'localhost'
};

// Clean URLs (remove trailing slashes)
const RENDER_API_URL = config.renderApiUrl.replace(/\/$/, '');
const VERCEL_API_URL = config.vercelApiUrl.replace(/\/$/, '');
const LOCAL_API_URL = 'http://localhost:5000';

// Helper function to construct URLs safely with cache busting
const buildUrl = (baseUrl: string, path: string, useCacheBust = false): string => {
  try {
    const url = new URL(path, baseUrl);
    
    // Add cache busting parameter for production to prevent stale cache issues
    if (useCacheBust && config.isProduction) {
      url.searchParams.set('_t', Date.now().toString());
    }
    
    return url.toString();
  } catch (error) {
    console.error(`Error building URL for ${baseUrl}${path}:`, error);
    return `${baseUrl}${path}`;
  }
};

export const API_ENDPOINTS = {
  // Stripe endpoints (Render backend)
  STRIPE: {
    TEST: buildUrl(RENDER_API_URL, '/api/stripe/test'),
    CREATE_PAYMENT_INTENT: buildUrl(RENDER_API_URL, '/api/stripe/create-payment-intent'),
    CREATE_CHECKOUT_SESSION: buildUrl(RENDER_API_URL, '/api/stripe/create-checkout-session'),
    GET_PAYMENT_INTENT: (id: string) => buildUrl(RENDER_API_URL, `/api/stripe/payment-intent/${id}`),
    GET_CHECKOUT_SESSION: (id: string) => buildUrl(RENDER_API_URL, `/api/stripe/checkout-session/${id}`),
  },
  
  // Render backend endpoints (production)
  RENDER: {
    PRODUCTS: buildUrl(RENDER_API_URL, '/api/products'),
    PRODUCT_BY_SLUG: (slug: string) => buildUrl(RENDER_API_URL, `/api/products/${slug}`),
    REVIEWS: buildUrl(RENDER_API_URL, '/api/reviews', true), // Use cache busting
    REVIEWS_BY_PRODUCT: (productId: number) => buildUrl(RENDER_API_URL, `/api/reviews/product/${productId}`, true), // Use cache busting
    CART_ADD: buildUrl(RENDER_API_URL, '/api/cart/add'),
    CART_REMOVE: buildUrl(RENDER_API_URL, '/api/cart/remove'),
    CART_CLEAR: buildUrl(RENDER_API_URL, '/api/cart/clear'),
    ORDERS: buildUrl(RENDER_API_URL, '/api/orders'),
  },
  
  // Vercel endpoints (fallback)
  VERCEL: {
    PRODUCTS: buildUrl(VERCEL_API_URL, '/api/products'),
    PRODUCT_BY_SLUG: (slug: string) => buildUrl(VERCEL_API_URL, `/api/products/${slug}`),
    REVIEWS: buildUrl(VERCEL_API_URL, '/api/reviews'),
    REVIEWS_BY_PRODUCT: (productId: number) => buildUrl(VERCEL_API_URL, `/api/reviews/product/${productId}`),
    CART_ADD: buildUrl(VERCEL_API_URL, '/api/cart/add'),
    CART_REMOVE: buildUrl(VERCEL_API_URL, '/api/cart/remove'),
    CART_CLEAR: buildUrl(VERCEL_API_URL, '/api/cart/clear'),
    ORDERS: buildUrl(VERCEL_API_URL, '/api/orders'),
  }
};

// Helper function to get the correct API URL based on endpoint type
export const getApiUrl = (endpoint: string): string => {
  try {
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
    // Handle specific Render endpoints using buildUrl for consistency
    if (normalizedEndpoint === '/api/products') {
      // Use local server for admin panel when running locally
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return buildUrl(LOCAL_API_URL, '/api/products');
      }
      return buildUrl(RENDER_API_URL, '/api/products');
    }
    if (normalizedEndpoint.startsWith('/api/products/') && normalizedEndpoint !== '/api/products') {
      const slug = normalizedEndpoint.replace('/api/products/', '');
      return buildUrl(RENDER_API_URL, `/api/products/${slug}`);
    }
    if (normalizedEndpoint === '/api/reviews') {
      return buildUrl(RENDER_API_URL, '/api/reviews', true); // Use cache busting
    }
    if (normalizedEndpoint.startsWith('/api/reviews/product/')) {
      const productId = normalizedEndpoint.replace('/api/reviews/product/', '');
      return buildUrl(RENDER_API_URL, `/api/reviews/product/${productId}`, true); // Use cache busting
    }
    if (normalizedEndpoint === '/api/cart/add') {
      return buildUrl(RENDER_API_URL, '/api/cart/add');
    }
    if (normalizedEndpoint === '/api/cart/remove') {
      return buildUrl(RENDER_API_URL, '/api/cart/remove');
    }
    if (normalizedEndpoint === '/api/cart/clear') {
      return buildUrl(RENDER_API_URL, '/api/cart/clear');
    }
    if (normalizedEndpoint.startsWith('/api/orders')) {
      // Use local server for admin panel when running locally
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return buildUrl(LOCAL_API_URL, '/api/orders');
      }
      return buildUrl(RENDER_API_URL, '/api/orders');
    }
    
    // Default to Render for any other endpoints
    return buildUrl(RENDER_API_URL, normalizedEndpoint);
  } catch (error) {
    console.error(`Error constructing API URL for endpoint: ${endpoint}`, error);
    // Fallback to simple concatenation if URL constructor fails
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${RENDER_API_URL}${normalizedEndpoint}`;
  }
};

// Environment configuration
export const API_CONFIG = {
  RENDER_BASE_URL: RENDER_API_URL,
  VERCEL_BASE_URL: VERCEL_API_URL,
  USE_RENDER_FOR_PAYMENTS: import.meta.env.VITE_USE_RENDER_PAYMENTS !== 'false', // Default to true
  IS_PRODUCTION: config.isProduction,
  IS_DEVELOPMENT: config.isDevelopment,
  CONFIG: config
};

// Export configuration for debugging and testing
export { config as API_ENV_CONFIG };
