import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { generateSellerOTP, verifySellerOTP, resendSellerOTP } from '../controllers/otpController';

const router = express.Router();

// Generate OTP for seller verification
router.post('/generate-otp', authenticateToken, generateSellerOTP);

// Verify OTP code
router.post('/verify-otp', authenticateToken, verifySellerOTP);

// Resend OTP
router.post('/resend-otp', authenticateToken, resendSellerOTP);

export default router;