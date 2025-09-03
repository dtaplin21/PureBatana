# Supabase Migration Analysis

## Current System Overview

### Database Configuration
- **Current Provider**: Neon PostgreSQL
- **ORM**: Drizzle ORM v0.44.5
- **Connection**: `@neondatabase/serverless` package
- **Schema Location**: `lib/schema.ts` and `shared/schema.ts` (duplicate)

### Database Schema (6 Tables)
1. **users** - Basic user info (id, email, name, createdAt)
2. **products** - Product catalog (id, name, slug, description, price, images, category, stock, etc.)
3. **cart_items** - Shopping cart (id, userId, productId, quantity, createdAt)
4. **orders** - Order management (id, userId, total, status, stripePaymentIntentId, timestamps)
5. **order_items** - Order line items (id, orderId, productId, quantity, price)
6. **reviews** - Product reviews (id, userId, productId, rating, comment, customerName, createdAt)

### Current Issues
- **Database Connection**: Neon serverless causing FUNCTION_INVOCATION_FAILED errors
- **Missing Tables**: Database exists but tables haven't been created
- **Import Issues**: Some endpoints still use old import patterns
- **Schema Duplication**: Schema defined in both `lib/schema.ts` and `shared/schema.ts`

## Supabase Migration Plan

### 1. Dependencies to Change
**Remove:**
```json
"@neondatabase/serverless": "^0.10.4"
```

**Add:**
```json
"@supabase/supabase-js": "^2.39.0",
"postgres": "^3.4.3"
```

### 2. Environment Variables to Update
**Current:**
```
DATABASE_URL=postgresql://...
```

**New (Supabase):**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

### 3. Files to Modify

#### Core Database Files:
- `lib/db.ts` - Replace Neon connection with Supabase
- `lib/schema.ts` - Keep as-is (Drizzle schema works with Supabase)
- `drizzle.config.ts` - Update to use new DATABASE_URL
- `package.json` - Update dependencies

#### API Endpoints (13 files):
- `api/db-test.ts` - Update connection test
- `api/products-simple.ts` - Update connection
- `api/products/index.ts` - Update connection
- `api/cart/add.ts` - Update connection
- `api/cart/remove.ts` - Update connection
- `api/cart/clear.ts` - Update connection
- `api/orders/index.ts` - Update connection
- `api/reviews/index.ts` - Update connection
- `api/checkout/create-session.ts` - Update connection
- `api/create-payment-intent.ts` - Update connection
- `api/check-products-table.ts` - Update connection
- `api/health.ts` - No changes needed
- `api/test.ts` - Update connection

#### Storage Layer:
- `lib/storage.ts` - Update DatabaseStorage class
- `server/storage.ts` - Update DatabaseStorage class

#### Legacy Files (can be removed after migration):
- `server/db.ts` - Old Express server database config
- `shared/schema.ts` - Duplicate schema file

### 4. Migration Strategy

#### Phase 1: Setup Supabase
1. Create Supabase project
2. Get connection strings and API keys
3. Update environment variables

#### Phase 2: Update Dependencies
1. Remove Neon dependencies
2. Add Supabase dependencies
3. Update package.json

#### Phase 3: Update Database Connection
1. Replace `lib/db.ts` with Supabase connection
2. Update `drizzle.config.ts`
3. Test basic connection

#### Phase 4: Create Database Schema
1. Run Drizzle migrations to create tables
2. Seed database with initial data
3. Verify all tables exist

#### Phase 5: Update API Endpoints
1. Update all API endpoints to use new connection
2. Test each endpoint systematically
3. Fix any remaining issues

#### Phase 6: Cleanup
1. Remove old Neon-specific code
2. Remove duplicate schema files
3. Update documentation

### 5. Supabase-Specific Considerations

#### Connection Pooling:
- Supabase handles connection pooling automatically
- No need for manual pool configuration
- Better performance in serverless environments

#### Authentication:
- Supabase has built-in auth (can be used later)
- Current system uses custom user management
- Can migrate to Supabase Auth in future

#### Real-time Features:
- Supabase offers real-time subscriptions
- Could enhance cart/order updates
- Not needed for initial migration

#### Edge Functions:
- Supabase Edge Functions could replace Vercel functions
- Keep Vercel for now, can migrate later

### 6. Testing Strategy

#### Database Connection Test:
```typescript
// Test basic connection
const { data, error } = await supabase.from('users').select('count')
```

#### Schema Validation:
```typescript
// Verify all tables exist
const tables = ['users', 'products', 'cart_items', 'orders', 'order_items', 'reviews']
```

#### Endpoint Testing:
- Test all 13 API endpoints
- Verify CRUD operations work
- Check error handling

### 7. Rollback Plan
- Keep current Neon setup until Supabase is fully tested
- Use feature flags to switch between databases
- Maintain backup of current working state

## Benefits of Supabase Migration

1. **Reliability**: More stable than Neon serverless
2. **Performance**: Better connection pooling
3. **Features**: Built-in auth, real-time, storage
4. **Support**: Better documentation and community
5. **Scalability**: Handles high traffic better
6. **Monitoring**: Built-in dashboard and metrics

## Estimated Timeline
- **Setup**: 30 minutes
- **Migration**: 2-3 hours
- **Testing**: 1-2 hours
- **Total**: 4-6 hours

## Risk Assessment
- **Low Risk**: Schema is already PostgreSQL-compatible
- **Medium Risk**: API endpoint updates
- **Mitigation**: Thorough testing and rollback plan
