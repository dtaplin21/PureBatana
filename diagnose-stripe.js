#!/usr/bin/env node

// Stripe Diagnostics Script
// This will help diagnose the Stripe errors on the admin page

import fetch from 'node-fetch';

console.log('🔍 Stripe Diagnostics');
console.log('==================');

// Test 1: Check backend Stripe connection
async function testBackendStripe() {
  console.log('\n1. Testing Backend Stripe Connection...');
  try {
    const response = await fetch('https://purebatana.onrender.com/api/stripe/test');
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Backend Stripe connection: WORKING');
      console.log(`   Account: ${data.data.accountName}`);
      console.log(`   Account ID: ${data.data.accountId}`);
      console.log(`   Charges Enabled: ${data.data.chargesEnabled}`);
      console.log(`   Payouts Enabled: ${data.data.payoutsEnabled}`);
    } else {
      console.log('❌ Backend Stripe connection: FAILED');
      console.log(`   Error: ${data.error}`);
    }
  } catch (error) {
    console.log('❌ Backend Stripe connection: FAILED');
    console.log(`   Error: ${error.message}`);
  }
}

// Test 2: Check if Stripe.js CDN is accessible
async function testStripeCDN() {
  console.log('\n2. Testing Stripe.js CDN Access...');
  try {
    const response = await fetch('https://js.stripe.com/v3/', {
      method: 'HEAD'
    });
    
    if (response.ok) {
      console.log('✅ Stripe.js CDN: ACCESSIBLE');
      console.log(`   Status: ${response.status}`);
    } else {
      console.log('❌ Stripe.js CDN: NOT ACCESSIBLE');
      console.log(`   Status: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Stripe.js CDN: NOT ACCESSIBLE');
    console.log(`   Error: ${error.message}`);
  }
}

// Test 3: Check Stripe API endpoints
async function testStripeAPI() {
  console.log('\n3. Testing Stripe API Endpoints...');
  
  const endpoints = [
    'https://r.stripe.com/b',
    'https://api.stripe.com/v1/account',
    'https://api.stripe.com/v1/balance'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'HEAD'
      });
      console.log(`✅ ${endpoint}: ${response.status}`);
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.message}`);
    }
  }
}

// Test 4: Check environment variables (if available)
function checkEnvironment() {
  console.log('\n4. Environment Variables Check...');
  
  const stripeKey = process.env.VITE_STRIPE_PUBLIC_KEY;
  if (stripeKey) {
    console.log('✅ VITE_STRIPE_PUBLIC_KEY: SET');
    console.log(`   Key starts with: ${stripeKey.substring(0, 10)}...`);
    console.log(`   Key type: ${stripeKey.startsWith('pk_live_') ? 'LIVE' : stripeKey.startsWith('pk_test_') ? 'TEST' : 'UNKNOWN'}`);
  } else {
    console.log('❌ VITE_STRIPE_PUBLIC_KEY: NOT SET');
  }
}

// Test 5: Check if the issue is browser-specific
function checkBrowserCompatibility() {
  console.log('\n5. Browser Compatibility Check...');
  console.log('ℹ️  The ERR_INTERNET_DISCONNECTED error suggests:');
  console.log('   - Browser cannot reach Stripe servers');
  console.log('   - Network connectivity issues');
  console.log('   - Firewall blocking Stripe domains');
  console.log('   - Invalid Stripe public key');
  console.log('   - Stripe.js loading on wrong pages');
}

// Main diagnostic function
async function runDiagnostics() {
  await testBackendStripe();
  await testStripeCDN();
  await testStripeAPI();
  checkEnvironment();
  checkBrowserCompatibility();
  
  console.log('\n🎯 Recommendations:');
  console.log('==================');
  console.log('1. Check if VITE_STRIPE_PUBLIC_KEY is set in Vercel environment variables');
  console.log('2. Verify the Stripe public key is valid and matches your account');
  console.log('3. Check if Stripe.js is being loaded on pages that don\'t need it');
  console.log('4. Test in a different browser or incognito mode');
  console.log('5. Check browser console for more detailed error messages');
  console.log('6. Verify network connectivity to Stripe domains');
}

runDiagnostics();
