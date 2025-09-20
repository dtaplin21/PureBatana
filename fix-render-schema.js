#!/usr/bin/env node

// Script to update Render backend schema to match local backend
// This will fix the price update issues

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Render backend schema...');

// Read the current render backend schema
const renderSchemaPath = path.join(__dirname, 'render-backend/src/schema.js');
const renderSchema = fs.readFileSync(renderSchemaPath, 'utf8');

console.log('📋 Current Render schema:');
console.log(renderSchema);

// Create the corrected schema that matches the local backend
const correctedSchema = `import { pgTable, serial, text, integer, boolean, timestamp, json } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  shortDescription: text('short_description'),
  price: integer('price').notNull(), // Changed from decimal to integer (cents)
  images: json('images').$type<string[]>(), // Changed from imageUrl to images array
  category: text('category').notNull(),
  stock: integer('stock').default(0),
  featured: boolean('featured').default(false),
  benefits: json('benefits').$type<string[]>(),
  usage: text('usage'),
  isBestseller: boolean('is_bestseller').default(false),
  isNew: boolean('is_new').default(false),
  viewCount: integer('view_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  productId: integer('product_id').notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  customerName: text('customer_name'),
  createdAt: timestamp('created_at').defaultNow()
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow()
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  total: integer('total').notNull(), // Changed from doublePrecision to integer (cents)
  status: text('status').default('pending').notNull(),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  shippingAddress: text('shipping_address'),
  billingAddress: text('billing_address'),
  email: text('email'),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull(),
  productId: integer('product_id').notNull(),
  quantity: integer('quantity').notNull(),
  price: integer('price').notNull() // Price in cents
});

export const cartItems = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  productId: integer('product_id').notNull(),
  quantity: integer('quantity').default(1).notNull(),
  createdAt: timestamp('created_at').defaultNow()
});
`;

// Write the corrected schema
fs.writeFileSync(renderSchemaPath, correctedSchema);

console.log('✅ Render backend schema updated!');
console.log('📋 Key changes:');
console.log('   - price: decimal → integer (cents)');
console.log('   - imageUrl → images array');
console.log('   - Added missing columns (benefits, usage, etc.)');
console.log('   - Added orders, orderItems, cartItems tables');
console.log('');
console.log('🚀 Next steps:');
console.log('   1. Commit and push changes');
console.log('   2. Update price update endpoint to use correct schema');
console.log('   3. Test admin panel price updates');
