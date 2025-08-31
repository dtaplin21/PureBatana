# API Routes

This directory contains Vercel Serverless Functions that replace the Express backend API.

## Structure

- **`/api/health`** - Health check endpoint to test database connectivity
- **`/api/products`** - Product listing with filtering, pagination, and sorting
- **`/api/cart/add`** - Add items to cart (POST)
- **`/api/cart/remove`** - Remove specific cart item (DELETE)
- **`/api/cart/clear`** - Clear all items from user's cart (DELETE)
- **`/api/orders`** - Fetch user orders (GET)
- **`/api/checkout/create-session`** - Create Stripe payment intent (POST)
- **`/api/reviews`** - Get and create product reviews (GET/POST)

## Features

- **Consistent Response Format**: All endpoints return standardized JSON responses with success/error status, data, and timestamps
- **Error Handling**: Comprehensive error handling with development vs production error messages
- **Type Safety**: Full TypeScript support with VercelRequest/VercelResponse types
- **Database Integration**: Uses Drizzle ORM with centralized database connection
- **Environment Variables**: Secure configuration using environment variables

## Response Format

```json
{
  "success": true,
  "data": {...},
  "message": "Optional message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Error Response Format

```json
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error message (dev only)",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Development

These functions can be tested locally using Vercel CLI or deployed directly to Vercel. The database connection is handled through the centralized `lib/db.ts` file.
