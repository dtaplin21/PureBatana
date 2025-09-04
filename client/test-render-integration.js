// Test script to verify Render backend integration
// Run this in the browser console on your frontend

async function testRenderIntegration() {
  console.log('🧪 Testing Render Backend Integration...');
  
  // Test 1: Check if environment variables are loaded
  console.log('\n1. Environment Variables:');
  console.log('VITE_RENDER_API_URL:', import.meta.env.VITE_RENDER_API_URL);
  console.log('VITE_USE_RENDER_PAYMENTS:', import.meta.env.VITE_USE_RENDER_PAYMENTS);
  
  // Test 2: Test API configuration
  console.log('\n2. API Configuration:');
  try {
    const { API_ENDPOINTS, API_CONFIG } = await import('./src/lib/apiConfig.ts');
    console.log('Render API URL:', API_CONFIG.RENDER_BASE_URL);
    console.log('Use Render for payments:', API_CONFIG.USE_RENDER_FOR_PAYMENTS);
    console.log('Stripe endpoints:', API_ENDPOINTS.STRIPE);
  } catch (error) {
    console.error('Error loading API config:', error);
  }
  
  // Test 3: Test payment service
  console.log('\n3. Payment Service:');
  try {
    const { paymentService } = await import('./src/lib/paymentService.ts');
    console.log('Payment service loaded successfully');
    
    // Test Stripe connection
    try {
      const result = await paymentService.testStripeConnection();
      console.log('✅ Stripe connection test:', result);
    } catch (error) {
      console.error('❌ Stripe connection test failed:', error);
    }
  } catch (error) {
    console.error('Error loading payment service:', error);
  }
  
  console.log('\n🎯 Integration test complete!');
}

// Run the test
testRenderIntegration();
