import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

// Database connection
const sql = postgres(process.env.DATABASE_URL, {
  max: 1,
  idle_timeout: 0,
  connect_timeout: 10,
  ssl: 'require'
});

async function updateProductPrices() {
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
    console.error('❌ Error updating prices:', error);
  }
}

updateProductPrices();
