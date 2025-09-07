import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { User } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'flamingo-ai-development-secret-key-2024-please-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface AuthRequest extends Request {
  user?: any;
}

export const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }

  try {
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }

    // Add session tracking for concurrent users
    req.user = {
      ...user.toJSON(),
      sessionId: `${user.id}-${Date.now()}`,
      lastActive: new Date()
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Optional auth middleware - doesn't fail if no token
export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      try {
        const user = await User.findByPk(decoded.userId);
        if (user) {
          req.user = user.toJSON();
        }
      } catch (error) {
        console.error('Optional auth error:', error);
      }
    }
  }

  next();
};

// Role-based authentication middleware
export function authenticateRole(requiredRole: 'admin' | 'manager' | 'user') {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userRole = req.user.role;
    
    // Admin has access to everything
    if (userRole === 'admin') {
      return next();
    }
    
    // Manager has access to manager and user content
    if (userRole === 'manager' && (requiredRole === 'manager' || requiredRole === 'user')) {
      return next();
    }
    
    // User only has access to user content
    if (userRole === 'user' && requiredRole === 'user') {
      return next();
    }
    
    return res.status(403).json({ message: 'Insufficient permissions' });
  };
}