/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import { errors } from '../utils/AppError';

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return next(errors.unauthorized('Admin access required'));
  }
  
  (req as any).admin = { id: 'admin', role: 'admin' };
  next();
};