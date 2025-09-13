import { Request, Response } from 'express';
import { prisma } from '../app';
import { generateOTP, generateOTPExpiry, hashOTP, verifyOTP } from '../utils/otpGenerator';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

// Generate OTP for seller verification
export const generateSellerOTP = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId, email, role } = req.user!;

    // Only sellers can request OTP
    if (role !== 'SELLER') {
      return res.status(403).json({ message: 'Only sellers can request OTP verification' });
    }

    // Check rate limiting - max 3 OTP requests per hour
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const recentOTPs = await prisma.otpVerification.count({
      where: {
        userId,
        createdAt: {
          gte: oneHourAgo
        }
      }
    });

    if (recentOTPs >= 3) {
      return res.status(429).json({ 
        message: 'Too many OTP requests. Please try again in an hour.' 
      });
    }

    // Generate new OTP
    const otpCode = generateOTP();
    const expiresAt = generateOTPExpiry();
    const hashedOTP = hashOTP(otpCode);

    // Clear any existing OTPs for this user
    await prisma.otpVerification.deleteMany({
      where: { userId }
    });

    // Store new OTP
    await prisma.otpVerification.create({
      data: {
        userId,
        otpCode: hashedOTP,
        expiresAt
      }
    });

    // In a real application, you'd send this via email
    // For now, we'll return it in the response (remove in production!)
    console.log(`OTP for ${email}: ${otpCode}`);

    res.json({
      message: 'OTP sent to your email address',
      email,
      // Remove this in production - OTP should only be sent via email
      developmentOTP: process.env.NODE_ENV === 'development' ? otpCode : undefined
    });

  } catch (error) {
    console.error('Generate OTP error:', error);
    res.status(500).json({ message: 'Failed to generate OTP' });
  }
};

// Verify OTP code
export const verifySellerOTP = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.user!;
    const { otpCode } = req.body;

    if (!otpCode || otpCode.length !== 6) {
      return res.status(400).json({ message: 'Please provide a valid 6-digit OTP' });
    }

    // Find the latest OTP for this user
    const otpRecord = await prisma.otpVerification.findFirst({
      where: { 
        userId,
        verified: false
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
    }

    // Check if OTP has expired
    if (new Date() > otpRecord.expiresAt) {
      await prisma.otpVerification.delete({
        where: { id: otpRecord.id }
      });
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Check attempt limit
    if (otpRecord.attempts >= 3) {
      await prisma.otpVerification.delete({
        where: { id: otpRecord.id }
      });
      return res.status(400).json({ message: 'Too many failed attempts. Please request a new OTP.' });
    }

    // Verify OTP
    const isValid = verifyOTP(otpCode, otpRecord.otpCode);

    if (!isValid) {
      // Increment attempts
      await prisma.otpVerification.update({
        where: { id: otpRecord.id },
        data: { attempts: otpRecord.attempts + 1 }
      });

      return res.status(400).json({ 
        message: 'Invalid OTP code',
        attemptsRemaining: 3 - (otpRecord.attempts + 1)
      });
    }

    // Mark OTP as verified
    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { verified: true }
    });

    // Generate seller session token (different from regular login token)
    const jwt = require('jsonwebtoken');
    const sellerToken = jwt.sign(
      { 
        userId, 
        email: req.user!.email, 
        role: req.user!.role,
        otpVerified: true,
        sessionType: 'seller'
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' } // Shorter expiry for seller sessions
    );

    res.json({
      message: 'OTP verified successfully',
      sellerToken,
      verified: true
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
};

// Resend OTP
export const resendSellerOTP = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId, email, role } = req.user!;

    if (role !== 'SELLER') {
      return res.status(403).json({ message: 'Only sellers can request OTP verification' });
    }

    // Check if there's a recent OTP (within last 2 minutes)
    const twoMinutesAgo = new Date();
    twoMinutesAgo.setMinutes(twoMinutesAgo.getMinutes() - 2);

    const recentOTP = await prisma.otpVerification.findFirst({
      where: {
        userId,
        createdAt: {
          gte: twoMinutesAgo
        }
      }
    });

    if (recentOTP) {
      return res.status(429).json({ 
        message: 'Please wait 2 minutes before requesting a new OTP' 
      });
    }

    // Generate and send new OTP (reuse the generate function)
    return generateSellerOTP(req, res);

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Failed to resend OTP' });
  }
};