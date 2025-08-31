# Migration Guide: Express to Vercel Serverless Functions

## Overview

This guide documents the migration from an Express.js backend to Vercel Serverless Functions while maintaining the existing Express server as a fallback.

## What Has Been Migrated

### ✅ Completed
- **API Structure**: Created `/api` directory with Vercel Serverless Functions
- **Database Layer**: Centralized database connection in `lib/db.ts`
- **Schema**: Moved database schema to `lib/schema.ts`
- **Cart Operations**: Add, remove, and clear cart items
- **Orders**: Fetch user orders
- **Checkout**: Stripe payment intent creation
- **Reviews**: Get and create product reviews
- **Products**: Advanced product listing with filtering and pagination
- **Health Check**: Database connectivity testing

### 🔄 In Progress
- **Frontend Integration**: Updating frontend to use new API endpoints
- **Testing**: Verifying all endpoints work correctly
- **Deployment**: Testing on Vercel

### ⏳ Pending
- **User Authentication**: Login, registration, session management
- **Admin Functions**: Product management, order processing
- **Email Notifications**: Order confirmations, status updates
- **SMS Notifications**: Order updates via Twilio
- **File Uploads**: Image management for products

## API Endpoints

| Endpoint | Method | Description | Status |
|----------|--------|-------------|---------|
| `/api/health` | GET | Health check & database connectivity | ✅ Complete |
| `/api/products` | GET | Product listing with filters | ✅ Complete |
| `/api/cart/add` | POST | Add item to cart | ✅ Complete |
| `/api/cart/remove` | DELETE | Remove cart item | ✅ Complete |
| `/api/cart/clear` | DELETE | Clear user's cart | ✅ Complete |
| `/api/orders` | GET | Fetch user orders | ✅ Complete |
| `/api/checkout/create-session` | POST | Create Stripe payment | ✅ Complete |
| `/api/reviews` | GET/POST | Product reviews | ✅ Complete |

## File Structure

```
├── api/                          # Vercel Serverless Functions
│   ├── health.ts                # Health check endpoint
│   ├── products/
│   │   └── index.ts             # Product listing
│   ├── cart/
│   │   ├── add.ts               # Add to cart
│   │   ├── remove.ts            # Remove from cart
│   │   └── clear.ts             # Clear cart
│   ├── orders/
│   │   └── index.ts             # User orders
│   ├── checkout/
│   │   └── create-session.ts    # Stripe checkout
│   └── reviews/
│       └── index.ts             # Product reviews
├── lib/                          # Shared utilities
│   ├── db.ts                    # Database connection
│   └── schema.ts                # Database schema
├── server/                       # Original Express server (fallback)
│   ├── index.express.ts         # Express entry point
│   └── routes.express.ts        # Express routes
└── client/                       # React frontend
```

## Response Format Standardization

All API endpoints now return consistent JSON responses:

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Optional message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error (dev only)",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Environment Variables

Required environment variables for the new API:

```bash
# Database
DATABASE_URL=postgresql://...

# Stripe
STRIPE_SECRET_KEY=sk_...

# Optional
NODE_ENV=production
```

## Testing

### Local Development
1. Start the Express fallback server: `npm run dev:express`
2. Test API endpoints: `node test-api.js`
3. Verify database connectivity

### Vercel Deployment
1. Deploy to Vercel: `vercel --prod`
2. Test endpoints on Vercel domain
3. Verify environment variables are set

## Rollback Plan

If issues arise with the new API:

1. **Immediate**: Use Express fallback server
2. **Short-term**: Fix specific API endpoints
3. **Long-term**: Complete migration or revert to Express

## Next Steps

1. **Test All Endpoints**: Verify functionality locally and on Vercel
2. **Frontend Integration**: Update React components to use new APIs
3. **Performance Testing**: Compare response times between Express and Serverless
4. **Monitoring**: Set up logging and error tracking
5. **Gradual Rollout**: Migrate traffic from Express to Serverless functions

## Benefits of Migration

- **Scalability**: Automatic scaling based on demand
- **Cost Efficiency**: Pay-per-use pricing model
- **Global Distribution**: Edge functions for better performance
- **Maintenance**: Reduced server management overhead
- **Integration**: Native Vercel ecosystem integration

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Cold starts | Keep Express fallback during transition |
| Database connections | Connection pooling and optimization |
| Environment variables | Secure Vercel configuration |
| API compatibility | Maintain response format consistency |
| Deployment issues | Staged rollout and monitoring |

## Support

For issues or questions during migration:
1. Check this guide first
2. Review API documentation in `/api/README.md`
3. Test with the provided test script
4. Use Express fallback if needed
