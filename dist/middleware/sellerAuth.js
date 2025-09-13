"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateSellerWithOTP = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateSellerWithOTP = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    console.log('Seller Auth - Header:', authHeader);
    console.log('Seller Auth - Token:', token ? 'Token present' : 'No token');
    if (!token) {
        console.log('Seller Auth - No token provided');
        return res.status(401).json({ message: 'Access token required' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log('Seller Auth - Decoded token:', {
            userId: decoded.userId,
            role: decoded.role,
            otpVerified: decoded.otpVerified,
            sessionType: decoded.sessionType
        });
        // Check if user is a seller
        if (decoded.role !== 'SELLER') {
            console.log('Seller Auth - User is not a seller');
            return res.status(403).json({ message: 'Seller access required' });
        }
        // Check if OTP has been verified for seller dashboard access
        if (!decoded.otpVerified || decoded.sessionType !== 'seller') {
            console.log('Seller Auth - OTP verification required');
            return res.status(403).json({
                message: 'OTP verification required for seller dashboard access',
                requiresOTP: true
            });
        }
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            otpVerified: decoded.otpVerified,
            sessionType: decoded.sessionType
        };
        console.log('Seller Auth - Success, user authenticated with OTP');
        next();
    }
    catch (error) {
        console.error('Seller Auth - Token verification failed:', error);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};
exports.authenticateSellerWithOTP = authenticateSellerWithOTP;
