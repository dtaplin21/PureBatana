#!/usr/bin/env node

import { neon } from '@neondatabase/serverless';
import readline from 'readline';

// Database connection
const sql = neon(process.env.DATABASE_URL);

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function listProducts() {
  try {
    const result = await sql`
      SELECT id, name, price 
      FROM products 
      ORDER BY id
    `;
    
    console.log('\n📋 Current Products:');
    console.log('─'.repeat(50));
    result.forEach(product => {
      console.log(`${product.id}. ${product.name}`);
      console.log(`   Current Price: $${(product.price / 100).toFixed(2)}`);
    });
    console.log('─'.repeat(50));
    
    return result;
  } catch (error) {
    console.error('❌ Error listing products:', error);
    return [];
  }
}

async function updateProductPrice(productId, newPrice) {
  try {
    const priceInCents = Math.round(newPrice * 100);
    
    const result = await sql`
      UPDATE products 
      SET price = ${priceInCents}, updated_at = NOW()
      WHERE id = ${productId}
      RETURNING id, name, price
    `;
    
    if (result.length === 0) {
      console.error(`❌ Product with ID ${productId} not found`);
      return false;
    }
    
    const product = result[0];
    console.log(`\n✅ Successfully updated!`);
    console.log(`   Product: ${product.name}`);
    console.log(`   New Price: $${(product.price / 100).toFixed(2)}`);
    return true;
    
  } catch (error) {
    console.error('❌ Error updating price:', error);
    return false;
  }
}

async function main() {
  console.log('🛒 Pure Batana Price Manager');
  console.log('============================');
  
  while (true) {
    console.log('\nOptions:');
    console.log('1. List all products');
    console.log('2. Update product price');
    console.log('3. Exit');
    
    const choice = await askQuestion('\nSelect an option (1-3): ');
    
    switch (choice.trim()) {
      case '1':
        await listProducts();
        break;
        
      case '2':
        await listProducts();
        
        const productIdStr = await askQuestion('\nEnter product ID: ');
        const productId = parseInt(productIdStr);
        
        if (isNaN(productId)) {
          console.log('❌ Invalid product ID');
          continue;
        }
        
        const newPriceStr = await askQuestion('Enter new price (e.g., 29.95): $');
        const newPrice = parseFloat(newPriceStr);
        
        if (isNaN(newPrice) || newPrice <= 0) {
          console.log('❌ Invalid price');
          continue;
        }
        
        await updateProductPrice(productId, newPrice);
        break;
        
      case '3':
        console.log('\n👋 Goodbye!');
        rl.close();
        process.exit(0);
        
      default:
        console.log('❌ Invalid option. Please choose 1, 2, or 3.');
    }
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\n👋 Goodbye!');
  rl.close();
  process.exit(0);
});

main().catch(console.error);
