# Render Backend Deployment Guide

## 🚀 Quick Start

### 1. Prerequisites
- Render account (https://render.com)
- Node.js 18+ installed locally
- Git repository with this backend code

### 2. Deploy to Render

#### Option A: Deploy from GitHub
1. Push this `render-backend` folder to a GitHub repository
2. Connect Render to your GitHub repository
3. Select the `render-backend` folder as the root directory
4. Render will automatically detect the Node.js app and deploy

#### Option B: Deploy with Render CLI
```bash
# Install Render CLI
npm install -g @render/cli

# Login to Render
render login

# Deploy
render deploy
```

### 3. Environment Variables
Set these in Render dashboard:

```bash
# Required
STRIPE_SECRET_KEY=sk_live_your_actual_key
FRONTEND_URL=https://your-frontend-domain.com

# Optional
NODE_ENV=production
PORT=10000
```

### 4. Test Deployment
```bash
# Health check
curl https://your-render-app.onrender.com/health

# Stripe test
curl https://your-render-app.onrender.com/api/stripe/test
```

## 🔧 Local Development

### 1. Install Dependencies
```bash
cd render-backend
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

Update your frontend API calls to point to the Render backend:

```javascript
// Before (Vercel)
const response = await fetch('/api/create-payment-intent', {
  method: 'POST',
  body: JSON.stringify(data)
});

// After (Render)
const response = await fetch('https://your-render-app.onrender.com/api/stripe/create-payment-intent', {
  method: 'POST',
  body: JSON.stringify(data)
});
```

## 🛠️ Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `FRONTEND_URL` is set correctly in Render
   - Check that your frontend domain is in the CORS origins

2. **Stripe Connection Issues**
   - Verify `STRIPE_SECRET_KEY` is set correctly
   - Check Stripe key format (should start with `sk_live_`)

3. **Port Issues**
   - Render automatically sets `PORT` environment variable
   - Don't hardcode port numbers

### Logs
View logs in Render dashboard or with CLI:
```bash
render logs
```

## 📊 Monitoring

Render provides built-in monitoring for:
- CPU usage
- Memory usage
- Request logs
- Error tracking
- Uptime monitoring

## 🔒 Security

- Environment variables are encrypted in Render
- CORS is configured for your frontend domain only
- Helmet.js provides security headers
- Stripe keys are never exposed to frontend

## 🚀 Scaling

Render automatically scales based on traffic. For high-traffic applications:
- Consider upgrading to Render Pro
- Monitor resource usage
- Set up proper logging and monitoring

## 💰 Pricing

- **Free Tier**: 750 hours/month, sleeps after 15 minutes of inactivity
- **Starter Plan**: $7/month, always on, 512MB RAM
- **Professional Plan**: $25/month, always on, 1GB RAM

## 🔄 Auto-Deploy

Render supports auto-deploy from GitHub:
1. Connect your GitHub repository
2. Enable auto-deploy on push to main branch
3. Render will automatically deploy changes
