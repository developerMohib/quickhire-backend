/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/AppError';
import { ApiResponse } from '../utils/ApiResponse';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let error = err;
  
  if (error instanceof AppError) {
    console.warn(`AppError: ${error.message}`);
    return res.status(error.statusCode).json(ApiResponse.error(error.message).toJSON());
  }
  
  // Mongoose validation errors
  if (error.name === 'ValidationError') {
    const messages = Object.values((error as any).errors).map((e: any) => e.message).join(', ');
    return res.status(StatusCodes.BAD_REQUEST).json(ApiResponse.error(messages).toJSON());
  }
  
  // Mongoose duplicate key errors
  if ((error as any).code === 11000) {
    const field = Object.keys((error as any).keyValue)[0];
    return res.status(StatusCodes.CONFLICT).json(ApiResponse.error(`${field} already exists`).toJSON());
  }
  
  // Mongoose cast errors (invalid ObjectId)
  if (error.name === 'CastError') {
    return res.status(StatusCodes.BAD_REQUEST).json(ApiResponse.error('Invalid ID format').toJSON());
  }
  
  // Log unexpected errors
  console.error('Unhandled Error:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });
  
  const message = process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message;
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ApiResponse.error(message).toJSON());
};