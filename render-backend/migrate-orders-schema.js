#!/usr/bin/env node

import postgres from 'postgres';

// Database connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

const sql = postgres(connectionString);

async function migrateOrdersSchema() {
  try {
    console.log('🔄 Starting orders table migration...');
    
    // Check if the new columns exist
    const columns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'orders' 
      AND table_schema = 'public'
    `;
    
    const columnNames = columns.map(col => col.column_name);
    console.log('📋 Current columns:', columnNames);
    
    // Add missing columns if they don't exist
    const migrations = [
      {
        column: 'total',
        type: 'double precision',
        constraint: 'NOT NULL',
        defaultValue: '0',
        check: !columnNames.includes('total')
      },
      {
        column: 'shipping_address',
        type: 'text',
        constraint: '',
        defaultValue: '',
        check: !columnNames.includes('shipping_address')
      },
      {
        column: 'billing_address',
        type: 'text',
        constraint: '',
        defaultValue: '',
        check: !columnNames.includes('billing_address')
      },
      {
        column: 'email',
        type: 'text',
        constraint: 'NOT NULL',
        defaultValue: "'unknown@example.com'",
        check: !columnNames.includes('email')
      },
      {
        column: 'name',
        type: 'text',
        constraint: 'NOT NULL',
        defaultValue: "'Unknown Customer'",
        check: !columnNames.includes('name')
      },
      {
        column: 'updated_at',
        type: 'timestamp',
        constraint: 'DEFAULT NOW()',
        defaultValue: '',
        check: !columnNames.includes('updated_at')
      }
    ];
    
    // Apply migrations
    for (const migration of migrations) {
      if (migration.check) {
        console.log(`➕ Adding column: ${migration.column}`);
        
        let query = `ALTER TABLE orders ADD COLUMN ${migration.column} ${migration.type}`;
        
        if (migration.constraint) {
          query += ` ${migration.constraint}`;
        }
        
        await sql.unsafe(query);
        
        // Set default values for existing rows if needed
        if (migration.defaultValue) {
          await sql.unsafe(`UPDATE orders SET ${migration.column} = ${migration.defaultValue} WHERE ${migration.column} IS NULL`);
        }
      } else {
        console.log(`✅ Column already exists: ${migration.column}`);
      }
    }
    
    // Drop old columns that are no longer needed
    const columnsToDrop = ['total_amount', 'stripe_session_id'];
    for (const column of columnsToDrop) {
      if (columnNames.includes(column)) {
        console.log(`⚠️  Note: Column '${column}' exists but is kept for compatibility`);
      }
    }
    
    console.log('✅ Orders table migration completed successfully!');
    
    // Show final table structure
    const finalColumns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'orders' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `;
    
    console.log('\n📊 Final table structure:');
    finalColumns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// Run migration
migrateOrdersSchema();
