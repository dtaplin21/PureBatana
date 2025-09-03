import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const sql = postgres(process.env.DATABASE_URL, {
  max: 1,
  idle_timeout: 0,
  connect_timeout: 10,
  ssl: 'require'
});

async function checkData() {
  try {
    console.log('🔍 Checking database data...');
    
    // Check products
    const products = await sql`SELECT COUNT(*) as count FROM products`;
    console.log('📦 Products count:', products[0].count);
    console.log('🔍 Products count type:', typeof products[0].count);
    console.log('🔍 Products count === 0:', products[0].count === 0);
    
    // Check users
    const users = await sql`SELECT COUNT(*) as count FROM users`;
    console.log('👥 Users count:', users[0].count);
    
    // Check reviews
    const reviews = await sql`SELECT COUNT(*) as count FROM reviews`;
    console.log('⭐ Reviews count:', reviews[0].count);
    
    if (parseInt(products[0].count) === 0) {
      console.log('🌱 No products found. Seeding database...');
      
      // Insert sample products
      await sql`
        INSERT INTO products (name, slug, description, short_description, price, images, category, stock, featured, benefits, usage, is_bestseller, is_new, view_count)
        VALUES 
        (
          'Pure Batana Oil',
          'pure-batana-oil',
          'Our 100% pure, cold-pressed Batana Oil is a traditional beauty elixir handcrafted by indigenous Miskito women in Honduras.',
          '100% pure, cold-pressed batana oil in a protective amber glass bottle with precision dropper.',
          2995,
          '["/images/batana-new.jpeg"]',
          'oils',
          100,
          true,
          '["Strengthens hair follicles", "Deeply moisturizes skin"]',
          'Apply a small amount to palms and work through damp hair.',
          true,
          false,
          0
        ),
        (
          'Batana Hair Mask',
          'batana-hair-mask',
          'Our intensive Batana Hair Mask combines our signature cold-pressed Batana Oil with botanical extracts.',
          'Intensive treatment mask with Batana Oil and nourishing botanical extracts for damaged hair.',
          3495,
          '["/images/batana-new.jpeg"]',
          'hair',
          75,
          true,
          '["Deeply conditions dry hair", "Restores natural moisture balance"]',
          'Apply generously to clean, damp hair from mid-lengths to ends.',
          false,
          true,
          0
        )
      `;
      
      console.log('✅ Sample products inserted!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sql.end();
  }
}

checkData();
