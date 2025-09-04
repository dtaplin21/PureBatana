# 🚀 Render Deployment Guide

## Step-by-Step Deployment Instructions

### 1. Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Verify your email address

### 2. Create New Web Service
1. Click **"New +"** button
2. Select **"Web Service"**
3. Connect your GitHub repository
4. Select the `render-backend` folder

### 3. Configure Service Settings
- **Name**: `pure-batana-stripe-backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Health Check Path**: `/health`

### 4. Set Environment Variables
In the Render dashboard, add these environment variables:

| Key | Value | Description |
|-----|-------|-------------|
| `STRIPE_SECRET_KEY` | `sk_live_your_stripe_secret_key_here` | Your Stripe secret key |
| `FRONTEND_URL` | `https://your-vercel-frontend.vercel.app` | Your Vercel frontend URL |
| `NODE_ENV` | `production` | Environment setting |

### 5. Deploy
1. Click **"Create Web Service"**
2. Wait for deployment to complete
3. Note the service URL (e.g., `https://pure-batana-stripe-backend.onrender.com`)

### 6. Test Deployment
Test the deployed service:

```bash
# Health check
curl https://your-service-url.onrender.com/health

# Stripe test
curl https://your-service-url.onrender.com/api/stripe/test

# Payment intent test
curl -X POST https://your-service-url.onrender.com/api/stripe/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{"amount": 2995, "currency": "usd"}'
```

### 7. Update Frontend Configuration
Once deployed, update your frontend environment variables:

```bash
# In your .env.local file
VITE_RENDER_API_URL=https://your-service-url.onrender.com
VITE_USE_RENDER_PAYMENTS=true
```

## 🔧 Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check that all dependencies are in `package.json`
   - Verify Node.js version compatibility

2. **Environment Variables Not Working**
   - Ensure variables are set in Render dashboard
   - Check for typos in variable names
   - Restart the service after adding variables

3. **CORS Errors**
   - Verify `FRONTEND_URL` is set correctly
   - Check that the frontend URL matches exactly

4. **Stripe Connection Fails**
   - Verify `STRIPE_SECRET_KEY` is correct
   - Check that the key is for the right environment (live vs test)

## 📊 Monitoring

- **Logs**: Available in Render dashboard
- **Health Check**: `/health` endpoint
- **Metrics**: CPU, Memory, Response time in dashboard

## 🔄 Updates

To update the service:
1. Push changes to your GitHub repository
2. Render will automatically redeploy
3. Monitor the deployment in the dashboard

## 💰 Cost

- **Free Tier**: 750 hours/month
- **Paid Plans**: Start at $7/month for always-on service
- **Bandwidth**: Included in all plans
