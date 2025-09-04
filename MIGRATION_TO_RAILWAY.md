# Migration from Vercel to Render Backend

## 🎯 Migration Overview

This migration moves Stripe payment processing from Vercel serverless functions to a dedicated Render backend, resolving connectivity issues.

## 📋 Migration Checklist

### Phase 1: Backend Setup ✅
- [x] Create Railway backend structure
- [x] Set up Express.js server with Stripe integration
- [x] Create API endpoints for payments
- [x] Configure environment variables
- [x] Create deployment configuration

### Phase 2: Railway Deployment
- [ ] Deploy backend to Railway
- [ ] Configure environment variables in Railway
- [ ] Test all Stripe endpoints
- [ ] Verify connectivity and performance

### Phase 3: Frontend Updates
- [ ] Update API configuration
- [ ] Modify payment components to use Railway
- [ ] Test payment flow end-to-end
- [ ] Update environment variables

### Phase 4: Cleanup
- [ ] Remove Stripe endpoints from Vercel
- [ ] Update documentation
- [ ] Monitor performance
- [ ] Set up monitoring and alerts

## 🚀 Step-by-Step Migration

### Step 1: Deploy Railway Backend

1. **Push to GitHub:**
   ```bash
   git add railway-backend/
   git commit -m "Add Railway backend for Stripe payments"
   git push origin main
   ```

2. **Deploy to Railway:**
   - Go to https://railway.app
   - Create new project from GitHub
   - Select the `railway-backend` folder
   - Set environment variables:
     - `STRIPE_SECRET_KEY=sk_live_your_key`
     - `FRONTEND_URL=https://your-frontend-domain.com`

3. **Test Deployment:**
   ```bash
   curl https://your-railway-app.railway.app/health
   curl https://your-railway-app.railway.app/api/stripe/test
   ```

### Step 2: Update Frontend

1. **Add Environment Variables:**
   ```bash
   # In client/.env.local
   VITE_RAILWAY_API_URL=https://your-railway-app.railway.app
   VITE_USE_RAILWAY_PAYMENTS=true
   ```

2. **Update Payment Components:**
   - Import `API_CONFIG` from `lib/apiConfig.ts`
   - Replace Vercel API calls with Railway API calls
   - Update error handling for new response format

3. **Test Frontend:**
   ```bash
   npm run dev
   # Test payment flow in browser
   ```

### Step 3: Remove Vercel Stripe Endpoints

1. **Delete Stripe Files:**
   ```bash
   rm api/create-payment-intent.ts
   rm api/checkout/create-session.ts
   rm api/stripe-test.ts
   ```

2. **Deploy Updated Vercel:**
   ```bash
   vercel --prod
   ```

## 🔧 Configuration Changes

### Backend (Railway)
- **Port:** 3001 (Railway auto-assigns)
- **CORS:** Configured for frontend domain
- **Stripe:** Latest API version with retry logic
- **Logging:** Comprehensive request/error logging

### Frontend
- **API Calls:** Hybrid approach (Railway for payments, Vercel for data)
- **Environment:** New variables for Railway backend
- **Error Handling:** Updated for new response format

## 📊 Benefits of Migration

1. **Reliability:** Dedicated server eliminates connectivity issues
2. **Performance:** Better resource allocation and caching
3. **Monitoring:** Railway provides detailed logs and metrics
4. **Scalability:** Easy to scale based on traffic
5. **Debugging:** Better error tracking and debugging tools

## 🚨 Rollback Plan

If issues arise:

1. **Immediate:** Revert frontend to use Vercel endpoints
2. **Quick Fix:** Deploy previous Vercel version
3. **Investigate:** Check Railway logs and configuration
4. **Retry:** Fix issues and redeploy

## 📈 Monitoring

After migration, monitor:
- Railway backend health and performance
- Stripe payment success rates
- Frontend error rates
- Response times for payment endpoints

## 🔒 Security Considerations

- Railway environment variables are encrypted
- CORS is properly configured
- Stripe keys remain secure
- No sensitive data in frontend code

## 📞 Support

- Railway Documentation: https://docs.railway.app
- Stripe Documentation: https://stripe.com/docs
- Project Issues: Check GitHub issues or contact support
