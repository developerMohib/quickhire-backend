import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError,z } from 'zod';
import { errors } from '../utils/AppError';

export const validate = <T>(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req[source]);
      req[source] = validatedData;
      next();
    } catch (error: unknown) {
      // 1. Explicitly check if it's a ZodError to get access to .issues
      if (error instanceof ZodError) {
        
        // 2. Map the Zod 'issues'
        const messages = error.issues
          .map((e) => `${e.path.join('.')}: ${e.message}`)
          .join(', ');

        // 3. Pass the combined string to your validation helper
        return next(errors.validation(messages));
      }
      
      // Pass other errors to error handler
      next(error);
    }
  };
};

// login register validation
export const authValidation = {
  login: z.object({
    identifier: z.string().min(1, 'Username or Email is required').trim(),
    password: z.string().min(6, 'Password must be at least 6 characters').trim(),
  }),
  
  register: z.object({
    username: z.string().min(3, 'Username must be at least 3 characters').trim(),
    email: z.string().email('Invalid email address').trim(),
    password: z.string().min(6, 'Password must be at least 6 characters').trim(),
  }),
};