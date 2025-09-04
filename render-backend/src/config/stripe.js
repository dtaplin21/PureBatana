import Stripe from 'stripe';

// Initialize Stripe with proper configuration for Render
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-03-31.basil', // Match your account version
  timeout: 30000, // 30 second timeout for dedicated server
  maxNetworkRetries: 3, // More retries for dedicated server
  telemetry: false, // Disable telemetry for better performance
});

export default stripe;