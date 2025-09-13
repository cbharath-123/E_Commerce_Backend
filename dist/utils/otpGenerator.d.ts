/**
 * Generate a 6-digit OTP code
 * @returns string - 6-digit OTP code
 */
export declare const generateOTP: () => string;
/**
 * Generate OTP expiration time (10 minutes from now)
 * @returns Date - Expiration timestamp
 */
export declare const generateOTPExpiry: () => Date;
/**
 * Hash OTP for secure storage
 * @param otp - Plain OTP code
 * @returns string - Hashed OTP
 */
export declare const hashOTP: (otp: string) => string;
/**
 * Verify OTP against hash
 * @param otp - Plain OTP code
 * @param hash - Stored hash
 * @returns boolean - Whether OTP matches
 */
export declare const verifyOTP: (otp: string, hash: string) => boolean;
