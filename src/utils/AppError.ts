import { StatusCodes } from 'http-status-codes';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errors = {
  notFound: (resource: string = 'Resource') => new AppError(`${resource} not found`, StatusCodes.NOT_FOUND),
  badRequest: (message: string = 'Bad Request') => new AppError(message, StatusCodes.BAD_REQUEST),
  unauthorized: (message: string = 'Unauthorized') => new AppError(message, StatusCodes.UNAUTHORIZED),
  forbidden: (message: string = 'Forbidden') => new AppError(message, StatusCodes.FORBIDDEN),
  validation: (message: string) => new AppError(message, StatusCodes.BAD_REQUEST, false),
  duplicate: (field: string) => new AppError(`${field} already exists`, StatusCodes.CONFLICT),
};