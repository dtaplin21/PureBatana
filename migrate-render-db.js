#!/usr/bin/env node

// Database migration script for Render backend
// This will update the production database schema to match local backend

import postgres from 'postgres';

// Get database URL from environment
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable not set');
  console.log('💡 Set it with: export DATABASE_URL="your-render-db-url"');
  process.exit(1);
}

const sql = postgres(DATABASE_URL);

async function migrateDatabase() {
  try {
    console.log('🔄 Starting database migration...');
    
    // Check current table structure
    console.log('📋 Checking current products table structure...');
    const currentColumns = await sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'products' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `;
    
    console.log('Current columns:', currentColumns);
    
    // Migration steps
    const migrations = [
      // Step 1: Add missing columns if they don't exist
      {
        name: 'Add missing product columns',
        sql: `
          ALTER TABLE products 
          ADD COLUMN IF NOT EXISTS short_description text,
          ADD COLUMN IF NOT EXISTS benefits json,
          ADD COLUMN IF NOT EXISTS usage text,
          ADD COLUMN IF NOT EXISTS is_bestseller boolean DEFAULT false,
          ADD COLUMN IF NOT EXISTS is_new boolean DEFAULT false,
          ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0,
          ADD COLUMN IF NOT EXISTS created_at timestamp DEFAULT now(),
          ADD COLUMN IF NOT EXISTS updated_at timestamp DEFAULT now()
        `
      },
      
      // Step 2: Convert price from decimal to integer (if needed)
      {
        name: 'Convert price to integer (cents)',
        sql: `
          -- First, update existing prices to cents
          UPDATE products SET price = ROUND(price * 100) WHERE price < 1000;
          
          -- Then change column type to integer
          ALTER TABLE products ALTER COLUMN price TYPE integer USING price::integer;
        `
      },
      
      // Step 3: Convert images column if needed
      {
        name: 'Update images column structure',
        sql: `
          -- If image_url exists, migrate to images array
          DO $$
          BEGIN
            IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'image_url') THEN
              UPDATE products SET images = json_build_array(image_url) WHERE image_url IS NOT NULL;
              ALTER TABLE products DROP COLUMN IF EXISTS image_url;
            END IF;
          END $$;
        `
      }
    ];
    
    // Execute migrations
    for (const migration of migrations) {
      console.log(`🔄 Running: ${migration.name}`);
      try {
        await sql.unsafe(migration.sql);
        console.log(`✅ Completed: ${migration.name}`);
      } catch (error) {
        console.log(`⚠️  Skipped: ${migration.name} (${error.message})`);
      }
    }
    
    // Verify final structure
    console.log('📋 Final products table structure:');
    const finalColumns = await sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'products' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `;
    
    console.log(finalColumns);
    
    console.log('✅ Database migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

migrateDatabase();
