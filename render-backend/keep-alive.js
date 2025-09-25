#!/usr/bin/env node

/**
 * Keep-Alive Script for Render Free Tier
 * 
 * This script pings the Render service every 10 minutes to prevent
 * the service from going to sleep (cold start issue).
 * 
 * Run this script on a free service like:
 * - GitHub Actions (free, runs every 10 minutes)
 * - UptimeRobot (free tier available)
 * - Cron-job.org (free tier)
 */

const https = require('https');

// Configuration
const SERVICE_URL = 'https://purebatana.onrender.com';
const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds
const ENDPOINTS_TO_PING = [
  '/health',
  '/api/products/pure-batana-oil',
  '/api/products'
];

function pingEndpoint(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `${SERVICE_URL}${endpoint}`;
    console.log(`🔄 Pinging: ${url}`);
    
    const startTime = Date.now();
    
    https.get(url, (res) => {
      const responseTime = Date.now() - startTime;
      console.log(`✅ ${endpoint} - Status: ${res.statusCode}, Time: ${responseTime}ms`);
      resolve({ endpoint, status: res.statusCode, time: responseTime });
    }).on('error', (error) => {
      console.error(`❌ ${endpoint} - Error:`, error.message);
      reject({ endpoint, error: error.message });
    });
  });
}

async function keepAlive() {
  console.log(`🚀 Starting keep-alive for ${SERVICE_URL}`);
  console.log(`⏰ Ping interval: ${PING_INTERVAL / 1000 / 60} minutes`);
  
  try {
    // Ping all endpoints
    const results = await Promise.allSettled(
      ENDPOINTS_TO_PING.map(endpoint => pingEndpoint(endpoint))
    );
    
    // Log results
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`✅ Success: ${result.value.endpoint}`);
      } else {
        console.log(`❌ Failed: ${ENDPOINTS_TO_PING[index]} - ${result.reason.error}`);
      }
    });
    
    console.log(`⏰ Next ping in ${PING_INTERVAL / 1000 / 60} minutes...\n`);
    
  } catch (error) {
    console.error('❌ Keep-alive failed:', error);
  }
}

// Run immediately
keepAlive();

// Then run every 10 minutes
setInterval(keepAlive, PING_INTERVAL);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Keep-alive stopped');
  process.exit(0);
});

console.log('🔄 Keep-alive service started. Press Ctrl+C to stop.');
