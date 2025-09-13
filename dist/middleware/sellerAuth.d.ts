import { Request, Response, NextFunction } from 'express';
interface SellerAuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: string;
        otpVerified?: boolean;
        sessionType?: string;
    };
}
export declare const authenticateSellerWithOTP: (req: SellerAuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export {};
