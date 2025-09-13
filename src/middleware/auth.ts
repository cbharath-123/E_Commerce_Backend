import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  console.log('Auth Header:', authHeader);
  console.log('Extracted Token:', token ? 'Token present' : 'No token');

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    console.log('Token decoded successfully for user:', decoded.userId);
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
    next();
  } catch (error: any) {
    console.log('Token verification failed:', error.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
