# Railway Backend Deployment Guide

## 🚀 Quick Start

### 1. Prerequisites
- Railway account (https://railway.app)
- Node.js 18+ installed locally
- Git repository with this backend code

### 2. Deploy to Railway

#### Option A: Deploy from GitHub
1. Push this `railway-backend` folder to a GitHub repository
2. Connect Railway to your GitHub repository
3. Select the `railway-backend` folder as the root directory
4. Railway will automatically detect the Node.js app and deploy

#### Option B: Deploy with Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

### 3. Environment Variables
Set these in Railway dashboard:

```bash
# Required
STRIPE_SECRET_KEY=sk_live_your_actual_key
FRONTEND_URL=https://your-frontend-domain.com

# Optional
NODE_ENV=production
PORT=3001
```

### 4. Test Deployment
```bash
# Health check
curl https://your-railway-app.railway.app/health

# Stripe test
curl https://your-railway-app.railway.app/api/stripe/test
```

## 🔧 Local Development

### 1. Install Dependencies
```bash
cd railway-backend
npm install
```

### 2. Set Environment Variables
```bash
cp env.example .env
# Edit .env with your actual values
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Test Locally
```bash
# Health check
curl http://localhost:3001/health

# Stripe test
curl http://localhost:3001/api/stripe/test
```

## 📡 API Endpoints

### Health Check
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed health information

### Stripe Integration
- `GET /api/stripe/test` - Test Stripe connection
- `POST /api/stripe/create-payment-intent` - Create payment intent
- `POST /api/stripe/create-checkout-session` - Create checkout session
- `GET /api/stripe/payment-intent/:id` - Retrieve payment intent
- `GET /api/stripe/checkout-session/:id` - Retrieve checkout session

## 🔄 Frontend Integration

Update your frontend API calls to point to the Railway backend:

```javascript
// Before (Vercel)
const response = await fetch('/api/create-payment-intent', {
  method: 'POST',
  body: JSON.stringify(data)
});

// After (Railway)
const response = await fetch('https://your-railway-app.railway.app/api/stripe/create-payment-intent', {
  method: 'POST',
  body: JSON.stringify(data)
});
```

## 🛠️ Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `FRONTEND_URL` is set correctly in Railway
   - Check that your frontend domain is in the CORS origins

2. **Stripe Connection Issues**
   - Verify `STRIPE_SECRET_KEY` is set correctly
   - Check Stripe key format (should start with `sk_live_`)

3. **Port Issues**
   - Railway automatically sets `PORT` environment variable
   - Don't hardcode port numbers

### Logs
View logs in Railway dashboard or with CLI:
```bash
railway logs
```

## 📊 Monitoring

Railway provides built-in monitoring for:
- CPU usage
- Memory usage
- Request logs
- Error tracking

## 🔒 Security

- Environment variables are encrypted in Railway
- CORS is configured for your frontend domain only
- Helmet.js provides security headers
- Stripe keys are never exposed to frontend

## 🚀 Scaling

Railway automatically scales based on traffic. For high-traffic applications:
- Consider upgrading to Railway Pro
- Monitor resource usage
- Set up proper logging and monitoring
