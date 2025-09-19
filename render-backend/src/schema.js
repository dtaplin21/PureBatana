import { pgTable, serial, text, integer, decimal, timestamp, boolean, doublePrecision } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: text('image_url'),
  inStock: boolean('in_stock').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  productId: integer('product_id').notNull().references(() => products.id),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  customerName: text('customer_name'),
  createdAt: timestamp('created_at').defaultNow()
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  status: text('status').notNull().default('pending'),
  total: doublePrecision('total').notNull(),
  shippingAddress: text('shipping_address'),
  billingAddress: text('billing_address'),
  email: text('email').notNull(),
  name: text('name').notNull(),
  stripeSessionId: text('stripe_session_id'), // Keep for Stripe integration
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});
