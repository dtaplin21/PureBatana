// Simple test script to verify API endpoints
// Run with: node test-api.js

const testEndpoints = async () => {
  const baseUrl = 'http://localhost:3000'; // Adjust if needed
  
  console.log('🧪 Testing API endpoints...\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing /api/health...');
    const healthResponse = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthResponse.json();
    console.log('   Status:', healthResponse.status);
    console.log('   Response:', JSON.stringify(healthData, null, 2));
    console.log('');
    
    // Test products endpoint
    console.log('2. Testing /api/products...');
    const productsResponse = await fetch(`${baseUrl}/api/products`);
    const productsData = await productsResponse.json();
    console.log('   Status:', productsResponse.status);
    console.log('   Response:', JSON.stringify(productsData, null, 2));
    console.log('');
    
    console.log('✅ API tests completed!');
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
};

// Run tests
testEndpoints();
