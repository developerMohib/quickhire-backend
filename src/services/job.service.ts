/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';
import Job, { IJob } from '../models/job.model';
import { errors } from '../utils/AppError';

type JobFilter = any;
type JobSort = any;

interface JobListResult {
  data: IJob[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface JobWithExpiredFlag extends Omit<IJob, 'isExpired'> {
  is_expired?: boolean;
  isExpired(): boolean;
}

interface ListJobsParams {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  location?: string;
  remote?: boolean;
  employment_type?: string;
  sortBy: 'created_at' | 'title' | 'company';
  order: 'asc' | 'desc';
}

class JobService {
async listJobs(params: ListJobsParams): Promise<JobListResult> {
    const { 
      page, limit, search, category, location, remote, employment_type, sortBy, order 
    } = params;

    // Correct query: Only find jobs that haven't expired
    const query: JobFilter = { 
      $or: [
        { application_deadline: { $gte: new Date() } },
        { application_deadline: null },
        { application_deadline: { $exists: false } }
      ]
    };
    
    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (remote !== undefined) query.remote = remote;
    if (employment_type) query.employment_type = employment_type;
    
    const sortOption: JobSort = { 
      [sortBy]: order === 'asc' ? 1 : -1 
    };
    
    const [jobs, total] = await Promise.all([
      Job.find(query)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      Job.countDocuments(query),
    ]);
    
    return { 
      data: jobs, 
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) } 
    };
  }
  async getJobById(id: string): Promise<JobWithExpiredFlag> {
    if (!Types.ObjectId.isValid(id)) {
      throw errors.badRequest('Invalid job ID format');
    }

    const job = await Job.findById(id).exec();
    if (!job) throw errors.notFound('Job');

    const jobResult = job.toObject() as JobWithExpiredFlag;
    if (job.isExpired()) jobResult.is_expired = true;

    return jobResult;
  }

  async createJob(data: Partial<IJob>): Promise<IJob> {
    return await Job.create(data);
  }

  async updateJob(id: string, data: Partial<IJob>): Promise<IJob> {
    if (!Types.ObjectId.isValid(id))
      throw errors.badRequest('Invalid job ID format');

    const job = await Job.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).exec();

    if (!job) throw errors.notFound('Job');
    return job;
  }

  async deleteJob(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id))
      throw errors.badRequest('Invalid job ID format');

    const job = await Job.findByIdAndDelete(id).exec();
    if (!job) throw errors.notFound('Job');
  }

  async getCategories(): Promise<string[]> {
    return await Job.distinct('category');
  }

  async getLocations(): Promise<string[]> {
    return await Job.distinct('location');
  }
}

export default new JobService();
