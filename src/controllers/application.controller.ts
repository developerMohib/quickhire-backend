import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import applicationService from '../services/application.service';
import { ApiResponse, sendResponse } from '../utils/ApiResponse';

class ApplicationController {
  async createApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const application = await applicationService.createApplication(req.body);
      return sendResponse(res, StatusCodes.CREATED, ApiResponse.success('Application submitted successfully', application));
    } catch (error) { next(error); }
  }
  
async getApplicationsByJob(req: Request, res: Response, next: NextFunction) {
  try {
   const { jobId } = req.params as { jobId: string }; 
    
    // Use Number() or parseInt() with a radix (10) for clarity
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const result = await applicationService.getApplicationsByJob(jobId, page, limit);


    return sendResponse(
      res, 
      StatusCodes.OK, 
      ApiResponse.success('Applications retrieved successfully', result.data, result.meta)
    );
  } catch (error) { 
    next(error); 
  }
}
  
  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const { status } = req.body;
      const application = await applicationService.updateApplicationStatus(id, status);
      return sendResponse(res, StatusCodes.OK, ApiResponse.success('Application status updated successfully', application));
    } catch (error) { next(error); }
  }
}

export default new ApplicationController();