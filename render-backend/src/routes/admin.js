import express from 'express';

const router = express.Router();

// Admin access code verification
router.post('/verify', (req, res) => {
  try {
    const { accessCode } = req.body;
    
    // Simple access code verification
    // You can change this access code to whatever you want
    const validAccessCode = 'purebatana2024';
    
    if (accessCode === validAccessCode) {
      res.json({
        success: true,
        message: 'Access granted'
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Invalid access code'
      });
    }
    
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
