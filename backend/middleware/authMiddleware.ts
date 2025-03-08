import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

// Define the shape of your JWT payload
interface JwtPayload {
  id: string;
  email: string;
  name: string;
  iat?: number; 
  exp?: number; 
}

// Extend the Express Request type to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ 
        error: 'Authentication failed: No token provided' 
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ 
        error: 'Authentication failed: Invalid token format' 
      });
      return;
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;
    
    req.user = decoded;
    
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ 
        error: 'Authentication failed: Invalid token' 
      });
      return;
    }
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        error: 'Authentication failed: Token expired' 
      });
      return;
    }

    // Handle other unexpected errors
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      error: 'Authentication failed: Unable to verify token' 
    });
    return;
  }
};