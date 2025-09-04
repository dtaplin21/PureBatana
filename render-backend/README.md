# Pure Batana Stripe Backend

A dedicated backend service for handling Stripe payment processing, deployed on Render.

## 🚀 Features

- **Stripe Integration**: Full Stripe API integration with payment intents and checkout sessions
- **CORS Support**: Configured for frontend communication
- **Health Monitoring**: Built-in health check endpoints
- **Error Handling**: Comprehensive error handling and logging
- **Environment Configuration**: Flexible environment variable support

## 📋 API Endpoints

### Health Check
- `GET /health` - Basic health check
- `GET /` - Root endpoint with service info

### Stripe Endpoints
- `GET /api/stripe/test` - Test Stripe connection
- `POST /api/stripe/create-payment-intent` - Create payment intent
- `POST /api/stripe/create-checkout-session` - Create checkout session

## 🛠️ Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   ```bash
   cp env.example .env
   # Edit .env with your Stripe keys
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Start Production Server**
   ```bash
   npm start
   ```

## 🌍 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | Yes |
| `PORT` | Server port | No (default: 3001) |
| `NODE_ENV` | Environment | No (default: development) |

## 🚀 Deployment

This service is configured for deployment on Render:

1. **Connect Repository**: Link your GitHub repository
2. **Set Environment Variables**: Configure in Render dashboard
3. **Deploy**: Automatic deployment on push to main branch

## 📊 Monitoring

- Health check endpoint: `/health`
- Service info: `/`
- Stripe connection test: `/api/stripe/test`

## 🔧 Configuration

The service uses the following configuration:
- **Stripe API Version**: `2025-03-31.basil`
- **Timeout**: 10 seconds
- **Max Retries**: 2
- **CORS**: Configured for frontend domain
