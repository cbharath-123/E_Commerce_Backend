import express from 'express';
import { register, login, getProfile } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);

// Test route to verify token
router.get('/verify', authenticateToken, (req: any, res) => {
  res.json({ 
    message: 'Token is valid', 
    user: req.user 
  });
});

export default router;
