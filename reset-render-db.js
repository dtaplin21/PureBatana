#!/usr/bin/env node

// WARNING: This will DELETE ALL DATA in the Render database
// Only use this if you're okay with losing all existing data

import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable not set');
  process.exit(1);
}

const sql = postgres(DATABASE_URL);

async function resetDatabase() {
  try {
    console.log('⚠️  WARNING: This will DELETE ALL DATA in the database!');
    console.log('Press Ctrl+C to cancel, or wait 10 seconds to continue...');
    
    // Wait 10 seconds
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    console.log('🔄 Resetting database...');
    
    // Drop all tables
    const dropTables = [
      'DROP TABLE IF EXISTS cart_items CASCADE',
      'DROP TABLE IF EXISTS order_items CASCADE', 
      'DROP TABLE IF EXISTS orders CASCADE',
      'DROP TABLE IF EXISTS reviews CASCADE',
      'DROP TABLE IF EXISTS products CASCADE',
      'DROP TABLE IF EXISTS users CASCADE'
    ];
    
    for (const dropSQL of dropTables) {
      console.log(`🗑️  ${dropSQL}`);
      await sql.unsafe(dropSQL);
    }
    
    console.log('✅ All tables dropped');
    
    // Recreate tables with correct schema
    const createTables = [
      `CREATE TABLE "users" (
        "id" serial PRIMARY KEY NOT NULL,
        "email" text NOT NULL,
        "name" text,
        "created_at" timestamp DEFAULT now(),
        CONSTRAINT "users_email_unique" UNIQUE("email")
      )`,
      
      `CREATE TABLE "products" (
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
      )`,
      
      `CREATE TABLE "reviews" (
        "id" serial PRIMARY KEY NOT NULL,
        "user_id" integer NOT NULL,
        "product_id" integer NOT NULL,
        "rating" integer NOT NULL,
        "comment" text,
        "customer_name" text,
        "created_at" timestamp DEFAULT now()
      )`,
      
      `CREATE TABLE "orders" (
        "id" serial PRIMARY KEY NOT NULL,
        "user_id" integer NOT NULL,
        "total" integer NOT NULL,
        "status" text DEFAULT 'pending' NOT NULL,
        "stripe_payment_intent_id" text,
        "shipping_address" text,
        "billing_address" text,
        "email" text,
        "name" text,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      )`,
      
      `CREATE TABLE "order_items" (
        "id" serial PRIMARY KEY NOT NULL,
        "order_id" integer NOT NULL,
        "product_id" integer NOT NULL,
        "quantity" integer NOT NULL,
        "price" integer NOT NULL
      )`,
      
      `CREATE TABLE "cart_items" (
        "id" serial PRIMARY KEY NOT NULL,
        "user_id" integer NOT NULL,
        "product_id" integer NOT NULL,
        "quantity" integer DEFAULT 1 NOT NULL,
        "created_at" timestamp DEFAULT now()
      )`
    ];
    
    for (const createSQL of createTables) {
      console.log(`🏗️  Creating table...`);
      await sql.unsafe(createSQL);
    }
    
    // Add foreign key constraints
    const constraints = [
      'ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action',
      'ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action',
      'ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action',
      'ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action',
      'ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action',
      'ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action',
      'ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action'
    ];
    
    for (const constraint of constraints) {
      console.log(`🔗 Adding constraint...`);
      await sql.unsafe(constraint);
    }
    
    // Insert sample data
    console.log('🌱 Inserting sample data...');
    
    await sql`
      INSERT INTO products (name, slug, description, short_description, price, images, category, stock, featured, benefits, usage, is_bestseller, is_new, view_count)
      VALUES (
        'Pure Batana Oil',
        'pure-batana-oil', 
        'Premium 100% pure Batana oil for hair and skin care',
        'Premium 100% pure Batana oil for hair and skin care...',
        2995,
        '["/images/batana-front.jpg"]',
        'skincare',
        100,
        false,
        '["100% Pure and Natural", "Cold-Pressed Extraction", "Rich in Essential Fatty Acids", "Moisturizes and Nourishes"]',
        'Apply a few drops to clean skin or hair. Massage gently until absorbed.',
        false,
        true,
        0
      )
    `;
    
    console.log('✅ Database reset completed successfully!');
    console.log('📋 Next steps:');
    console.log('   1. Update render-backend/src/schema.js to match new structure');
    console.log('   2. Deploy and test admin panel');
    
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

resetDatabase();
