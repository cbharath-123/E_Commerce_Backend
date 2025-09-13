"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const otpController_1 = require("../controllers/otpController");
const router = express_1.default.Router();
// Generate OTP for seller verification
router.post('/generate-otp', auth_1.authenticateToken, otpController_1.generateSellerOTP);
// Verify OTP code
router.post('/verify-otp', auth_1.authenticateToken, otpController_1.verifySellerOTP);
// Resend OTP
router.post('/resend-otp', auth_1.authenticateToken, otpController_1.resendSellerOTP);
exports.default = router;
