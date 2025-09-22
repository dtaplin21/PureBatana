#!/usr/bin/env node

/**
 * Sync Local Price Changes to Production Database
 * 
 * This script updates the production database with the price changes
 * made in your local admin panel.
 */

import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

// Production database connection (you'll need to add this to your .env)
const PROD_DATABASE_URL = process.env.PROD_DATABASE_URL || process.env.DATABASE_URL;

if (!PROD_DATABASE_URL) {
  console.error('❌ PROD_DATABASE_URL not found in environment variables');
  console.log('Please add PROD_DATABASE_URL to your .env file with your production database URL');
  process.exit(1);
}

async function syncPrices() {
  const sql = postgres(PROD_DATABASE_URL, {
    max: 1,
    idle_timeout: 0,
    connect_timeout: 10,
    ssl: 'require'
  });

  try {
    console.log('🔄 Syncing prices to production database...');
    
    // Update Pure Batana Oil to $1.00 (100 cents)
    await sql`
      UPDATE products 
      SET price = 100 
      WHERE slug = 'pure-batana-oil'
    `;
    console.log('✅ Updated Pure Batana Oil price to $1.00');

    // Update Batana Hair Mask to $100.00 (10000 cents)
    await sql`
      UPDATE products 
      SET price = 10000 
      WHERE slug = 'batana-hair-mask'
    `;
    console.log('✅ Updated Batana Hair Mask price to $100.00');

    // Verify the changes
    const products = await sql`
      SELECT id, name, slug, price 
      FROM products 
      ORDER BY id
    `;
    
    console.log('\n📊 Updated prices in production:');
    products.forEach(product => {
      const priceInDollars = (product.price / 100).toFixed(2);
      console.log(`  ${product.name}: $${priceInDollars}`);
    });

    console.log('\n🎉 Price sync completed successfully!');
    console.log('Your live website should now show the updated prices.');
    
  } catch (error) {
    console.error('❌ Error syncing prices:', error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// Run the sync
syncPrices();
