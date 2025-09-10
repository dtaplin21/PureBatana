import { neon } from '@neondatabase/serverless';
import ws from 'ws';

// Configure Neon with WebSocket
const neonConfig = {
  connectionString: process.env.DATABASE_URL,
  webSocketConstructor: ws,
};

const sql = neon(neonConfig);

async function updateProductPrice() {
  try {
    console.log('Connecting to production database...');
    
    // Update Pure Batana Oil price to 2995 cents ($29.95)
    const result = await sql`
      UPDATE products 
      SET price = 2995 
      WHERE id = 1 AND name = 'Pure Batana Oil'
    `;
    
    console.log('Updated Pure Batana Oil price to 2995 cents ($29.95)');
    
    // Verify the update
    const product = await sql`
      SELECT id, name, price 
      FROM products 
      WHERE id = 1
    `;
    
    console.log('Updated product:', product[0]);
    
    console.log('✅ Price update completed successfully!');
    
  } catch (error) {
    console.error('❌ Error updating price:', error);
  }
}

updateProductPrice();
