"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.hashOTP = exports.generateOTPExpiry = exports.generateOTP = void 0;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Generate a 6-digit OTP code
 * @returns string - 6-digit OTP code
 */
const generateOTP = () => {
    return crypto_1.default.randomInt(100000, 999999).toString();
};
exports.generateOTP = generateOTP;
/**
 * Generate OTP expiration time (10 minutes from now)
 * @returns Date - Expiration timestamp
 */
const generateOTPExpiry = () => {
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 10); // 10 minutes expiry
    return expiryTime;
};
exports.generateOTPExpiry = generateOTPExpiry;
/**
 * Hash OTP for secure storage
 * @param otp - Plain OTP code
 * @returns string - Hashed OTP
 */
const hashOTP = (otp) => {
    return crypto_1.default.createHash('sha256').update(otp).digest('hex');
};
exports.hashOTP = hashOTP;
/**
 * Verify OTP against hash
 * @param otp - Plain OTP code
 * @param hash - Stored hash
 * @returns boolean - Whether OTP matches
 */
const verifyOTP = (otp, hash) => {
    return (0, exports.hashOTP)(otp) === hash;
};
exports.verifyOTP = verifyOTP;
