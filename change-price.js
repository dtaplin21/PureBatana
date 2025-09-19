#!/usr/bin/env node

import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import { products } from './lib/schema.js';

// Database connection
const sql = neon(process.env.DATABASE_URL);

async function updateProductPrice(productId, newPrice) {
  try {
    console.log(`🔄 Updating product ${productId} to $${newPrice}...`);
    
    // Convert dollars to cents
    const priceInCents = Math.round(newPrice * 100);
    
    // Update the product price
    const result = await sql`
      UPDATE products 
      SET price = ${priceInCents}, updated_at = NOW()
      WHERE id = ${productId}
      RETURNING id, name, price
    `;
    
    if (result.length === 0) {
      console.error(`❌ Product with ID ${productId} not found`);
      return;
    }
    
    const product = result[0];
    console.log(`✅ Updated: ${product.name}`);
    console.log(`   New price: $${(product.price / 100).toFixed(2)}`);
    
  } catch (error) {
    console.error('❌ Error updating price:', error);
  }
}

async function listProducts() {
  try {
    console.log('📋 Current products:');
    const result = await sql`
      SELECT id, name, price 
      FROM products 
      ORDER BY id
    `;
    
    result.forEach(product => {
      console.log(`   ${product.id}. ${product.name} - $${(product.price / 100).toFixed(2)}`);
    });
    
  } catch (error) {
    console.error('❌ Error listing products:', error);
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: node change-price.js [product-id] [new-price]');
  console.log('       node change-price.js list');
  console.log('');
  listProducts();
} else if (args[0] === 'list') {
  listProducts();
} else if (args.length === 2) {
  const productId = parseInt(args[0]);
  const newPrice = parseFloat(args[1]);
  
  if (isNaN(productId) || isNaN(newPrice)) {
    console.error('❌ Invalid product ID or price');
    process.exit(1);
  }
  
  await updateProductPrice(productId, newPrice);
} else {
  console.error('❌ Invalid arguments');
  console.log('Usage: node change-price.js [product-id] [new-price]');
  console.log('       node change-price.js list');
}
