#!/usr/bin/env node

// Script to fix Stripe loading issues by implementing lazy loading

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Fixing Stripe Loading Issues...');

// Fix 1: Update EmbeddedCheckoutPage to lazy load Stripe
const embeddedCheckoutPath = path.join(__dirname, 'client/src/pages/EmbeddedCheckoutPage.tsx');
let embeddedCheckout = fs.readFileSync(embeddedCheckoutPath, 'utf8');

// Replace the immediate loadStripe call with lazy loading
const oldStripeInit = `const LIVE_STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(LIVE_STRIPE_PUBLIC_KEY);`;

const newStripeInit = `// Lazy load Stripe only when needed
const getStripePromise = async () => {
  const { loadStripe } = await import('@stripe/stripe-js');
  const LIVE_STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  
  if (!LIVE_STRIPE_PUBLIC_KEY) {
    console.warn('⚠️ VITE_STRIPE_PUBLIC_KEY not set - Stripe functionality disabled');
    return null;
  }
  
  return loadStripe(LIVE_STRIPE_PUBLIC_KEY);
};`;

embeddedCheckout = embeddedCheckout.replace(oldStripeInit, newStripeInit);

// Update the Elements component to use lazy loading
const oldElements = `<Elements stripe={stripePromise}>`;
const newElements = `<Elements stripe={getStripePromise()}>`;

embeddedCheckout = embeddedCheckout.replace(oldElements, newElements);

fs.writeFileSync(embeddedCheckoutPath, embeddedCheckout);

// Fix 2: Update CheckoutPage to lazy load Stripe
const checkoutPagePath = path.join(__dirname, 'client/src/pages/CheckoutPage.tsx');
let checkoutPage = fs.readFileSync(checkoutPagePath, 'utf8');

const oldCheckoutStripe = `// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);`;

const newCheckoutStripe = `// Lazy load Stripe only when needed
const getStripePromise = async () => {
  const { loadStripe } = await import('@stripe/stripe-js');
  const LIVE_STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  
  if (!LIVE_STRIPE_PUBLIC_KEY) {
    console.warn('⚠️ VITE_STRIPE_PUBLIC_KEY not set - Stripe functionality disabled');
    return null;
  }
  
  return loadStripe(LIVE_STRIPE_PUBLIC_KEY);
};`;

checkoutPage = checkoutPage.replace(oldCheckoutStripe, newCheckoutStripe);

// Update Elements in CheckoutPage
const oldCheckoutElements = `<Elements stripe={stripePromise}>`;
const newCheckoutElements = `<Elements stripe={getStripePromise()}>`;

checkoutPage = checkoutPage.replace(oldCheckoutElements, newCheckoutElements);

fs.writeFileSync(checkoutPagePath, checkoutPage);

// Fix 3: Update CheckoutSuccessPage to lazy load Stripe
const successPagePath = path.join(__dirname, 'client/src/pages/CheckoutSuccessPage.tsx');
let successPage = fs.readFileSync(successPagePath, 'utf8');

const oldSuccessStripe = `const LIVE_STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(LIVE_STRIPE_PUBLIC_KEY);`;

const newSuccessStripe = `// Lazy load Stripe only when needed
const getStripePromise = async () => {
  const { loadStripe } = await import('@stripe/stripe-js');
  const LIVE_STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  
  if (!LIVE_STRIPE_PUBLIC_KEY) {
    console.warn('⚠️ VITE_STRIPE_PUBLIC_KEY not set - Stripe functionality disabled');
    return null;
  }
  
  return loadStripe(LIVE_STRIPE_PUBLIC_KEY);
};`;

successPage = successPage.replace(oldSuccessStripe, newSuccessStripe);

fs.writeFileSync(successPagePath, successPage);

console.log('✅ Stripe lazy loading implemented!');
console.log('📋 Changes made:');
console.log('   - EmbeddedCheckoutPage: Lazy load Stripe');
console.log('   - CheckoutPage: Lazy load Stripe');
console.log('   - CheckoutSuccessPage: Lazy load Stripe');
console.log('');
console.log('🚀 Benefits:');
console.log('   - Stripe.js only loads on checkout pages');
console.log('   - No Stripe errors on admin page');
console.log('   - Better performance');
console.log('   - Graceful handling of missing API keys');
console.log('');
console.log('📝 Next steps:');
console.log('   1. Commit changes: git add . && git commit -m "Implement Stripe lazy loading"');
console.log('   2. Deploy: git push origin main');
console.log('   3. Test admin page - Stripe errors should be gone!');
