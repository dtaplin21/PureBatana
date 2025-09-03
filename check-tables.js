import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const sql = postgres(process.env.DATABASE_URL, {
  max: 1,
  idle_timeout: 0,
  connect_timeout: 10,
  ssl: 'require'
});

async function checkTables() {
  try {
    console.log('🔍 Checking database tables...');
    
    // Check if tables exist
    const result = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    
    console.log('📋 Existing tables:', result.map(r => r.table_name));
    
    if (result.length === 0) {
      console.log('❌ No tables found. Creating tables...');
      
      // Create tables manually
      await sql`
        CREATE TABLE IF NOT EXISTS "users" (
          "id" serial PRIMARY KEY NOT NULL,
          "email" text NOT NULL,
          "name" text,
          "created_at" timestamp DEFAULT now(),
          CONSTRAINT "users_email_unique" UNIQUE("email")
        );
      `;
      
      await sql`
        CREATE TABLE IF NOT EXISTS "products" (
          "id" serial PRIMARY KEY NOT NULL,
          "name" text NOT NULL,
          "slug" text NOT NULL,
          "description" text NOT NULL,
          "short_description" text,
          "price" integer NOT NULL,
          "images" json,
          "category" text NOT NULL,
          "stock" integer DEFAULT 0,
          "featured" boolean DEFAULT false,
          "benefits" json,
          "usage" text,
          "is_bestseller" boolean DEFAULT false,
          "is_new" boolean DEFAULT false,
          "view_count" integer DEFAULT 0,
          "created_at" timestamp DEFAULT now(),
          "updated_at" timestamp DEFAULT now(),
          CONSTRAINT "products_slug_unique" UNIQUE("slug")
        );
      `;
      
      await sql`
        CREATE TABLE IF NOT EXISTS "cart_items" (
          "id" serial PRIMARY KEY NOT NULL,
          "user_id" integer NOT NULL,
          "product_id" integer NOT NULL,
          "quantity" integer DEFAULT 1 NOT NULL,
          "created_at" timestamp DEFAULT now()
        );
      `;
      
      await sql`
        CREATE TABLE IF NOT EXISTS "orders" (
          "id" serial PRIMARY KEY NOT NULL,
          "user_id" integer NOT NULL,
          "total" integer NOT NULL,
          "status" text DEFAULT 'pending' NOT NULL,
          "stripe_payment_intent_id" text,
          "created_at" timestamp DEFAULT now(),
          "updated_at" timestamp DEFAULT now()
        );
      `;
      
      await sql`
        CREATE TABLE IF NOT EXISTS "order_items" (
          "id" serial PRIMARY KEY NOT NULL,
          "order_id" integer NOT NULL,
          "product_id" integer NOT NULL,
          "quantity" integer NOT NULL,
          "price" integer NOT NULL
        );
      `;
      
      await sql`
        CREATE TABLE IF NOT EXISTS "reviews" (
          "id" serial PRIMARY KEY NOT NULL,
          "user_id" integer NOT NULL,
          "product_id" integer NOT NULL,
          "rating" integer NOT NULL,
          "comment" text,
          "customer_name" text,
          "created_at" timestamp DEFAULT now()
        );
      `;
      
      console.log('✅ Tables created successfully!');
    } else {
      console.log('✅ Tables already exist!');
    }
    
    // Check again
    const finalResult = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    
    console.log('📋 Final tables:', finalResult.map(r => r.table_name));
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sql.end();
  }
}

checkTables();
