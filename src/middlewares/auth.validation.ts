/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import { errors } from '../utils/AppError';
import { verifyToken } from '../utils/jwt';

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || typeof authHeader !== 'string') {
    return next(errors.unauthorized('No authorization header provided'));
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return next(errors.unauthorized('No token provided'));
  }

  try {
    const decoded = verifyToken(token);
    (req as any).admin = decoded;
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error); // Log actual error for debugging
    return next(errors.unauthorized('Invalid or expired token'));
  }
};