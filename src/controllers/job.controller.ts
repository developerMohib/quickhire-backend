/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import jobService from '../services/job.service';
import { ApiResponse, sendResponse } from '../utils/ApiResponse';
import { jobValidation } from '../validations/job.validation';

class JobController {

async listJobs(req: Request, res: Response, next: NextFunction) {
  try {
    const queryParams = jobValidation.listQuery.parse(req.query);
    const result = await jobService.listJobs(queryParams);
    return sendResponse(res, StatusCodes.OK, 
      ApiResponse.success('Jobs retrieved successfully', result.data, result.meta)
    );
  } catch (error) { 
    next(error); 
  }
}
  async getJob(req: Request, res: Response, next: NextFunction) {
    try {
      const jobId = req.params.id as string;
      const job = await jobService.getJobById(jobId);
      return sendResponse(
        res,
        StatusCodes.OK,
        ApiResponse.success('Job retrieved successfully', job),
      );
    } catch (error) {
      next(error);
    }
  }

  async createJob(req: Request, res: Response, next: NextFunction) {
    try {
      const job = await jobService.createJob(req.body);
      return sendResponse(
        res,
        StatusCodes.CREATED,
        ApiResponse.success('Job created successfully', job),
      );
    } catch (error) {
      next(error);
    }
  }

  async updateJob(req: Request, res: Response, next: NextFunction) {
    try {
      const jobId = req.params.id as string;
      const job = await jobService.updateJob(jobId, req.body);
      return sendResponse(
        res,
        StatusCodes.OK,
        ApiResponse.success('Job updated successfully', job),
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteJob(req: Request, res: Response, next: NextFunction) {
    try {
      const jobId = req.params.id as string;
      await jobService.deleteJob(jobId);
      return sendResponse(
        res,
        StatusCodes.OK,
        ApiResponse.success('Job deleted successfully'),
      );
    } catch (error) {
      next(error);
    }
  }

  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await jobService.getCategories();
      return sendResponse(
        res,
        StatusCodes.OK,
        ApiResponse.success('Categories retrieved successfully', categories),
      );
    } catch (error) {
      next(error);
    }
  }

  async getLocations(req: Request, res: Response, next: NextFunction) {
    try {
      const locations = await jobService.getLocations();
      return sendResponse(
        res,
        StatusCodes.OK,
        ApiResponse.success('Locations retrieved successfully', locations),
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new JobController();
