import { StatusCodes } from 'http-status-codes';

export class ApiResponse<T = any> {
  constructor(
    public success: boolean,
    public message: string,
    public data?: T,
    public meta?: { page?: number; limit?: number; total?: number; totalPages?: number; }
  ) {}

  static success<T>(message: string, data?: T, meta?: any) {
    return new ApiResponse(true, message, data, meta);
  }

  static error(message: string) {
    return new ApiResponse(false, message);
  }

  toJSON() {
    return {
      success: this.success,
      message: this.message,
      ...(this.data && { data: this.data }),
      ...(this.meta && { meta: this.meta }),
    };
  }
}

export const sendResponse = <T>(res: any, statusCode: number, response: ApiResponse<T>) => {
  return res.status(statusCode).json(response.toJSON());
};

export const sendError = (res: any, statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR, message: string = 'Internal Server Error') => {
  return res.status(statusCode).json(ApiResponse.error(message).toJSON());
};