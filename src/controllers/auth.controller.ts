import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { ApiResponse, sendResponse } from '../utils/ApiResponse';
import { StatusCodes } from 'http-status-codes';

class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { identifier, password } = req.body;
      const result = await authService.login(identifier, password);

      return sendResponse(
        res,
        StatusCodes.OK,
        ApiResponse.success('Login successful', result),
      );
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Destructure email as well
      const { username, email, password } = req.body;
      // 2. Pass the whole data object to the service
      const result = await authService.register({ username, email, password });

      return sendResponse(
        res,
        StatusCodes.CREATED,
        ApiResponse.success('Register successful', result),
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
