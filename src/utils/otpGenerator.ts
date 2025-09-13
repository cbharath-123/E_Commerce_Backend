import crypto from 'crypto';

/**
 * Generate a 6-digit OTP code
 * @returns string - 6-digit OTP code
 */
export const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Generate OTP expiration time (10 minutes from now)
 * @returns Date - Expiration timestamp
 */
export const generateOTPExpiry = (): Date => {
  const expiryTime = new Date();
  expiryTime.setMinutes(expiryTime.getMinutes() + 10); // 10 minutes expiry
  return expiryTime;
};

/**
 * Hash OTP for secure storage
 * @param otp - Plain OTP code
 * @returns string - Hashed OTP
 */
export const hashOTP = (otp: string): string => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

/**
 * Verify OTP against hash
 * @param otp - Plain OTP code
 * @param hash - Stored hash
 * @returns boolean - Whether OTP matches
 */
export const verifyOTP = (otp: string, hash: string): boolean => {
  return hashOTP(otp) === hash;
};