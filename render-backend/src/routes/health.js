import express from 'express';

const router = express.Router();

// Health check endpoint
router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0',
    platform: 'Render'
  });
});

// Detailed health check
router.get('/detailed', (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0',
    platform: 'Render',
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3001,
    services: {
      stripe: process.env.STRIPE_SECRET_KEY ? 'configured' : 'missing',
      database: process.env.DATABASE_URL ? 'configured' : 'missing'
    }
  };
  
  res.json(health);
});

export default router;