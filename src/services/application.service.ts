import Application, { IApplication } from "../models/application.model";
import Job from "../models/job.model";
import { errors } from "../utils/AppError";
import { MongoError, ObjectId } from 'mongodb';

class ApplicationService {
  async createApplication(data: Partial<IApplication>): Promise<IApplication> {
    console.log('data',data)
    if(!data._id){
      errors.notFound('Job');
    }
    const job = await Job.findById({ _id: data.job_id });
    if (!job) throw errors.notFound('Job');
    if (job.isExpired()) throw errors.badRequest('This job is no longer accepting applications');
    
    try {
      const application = await Application.create(data);
      return await Application.findById(application._id).populate('job', 'title company location') || application;
    } catch (error: unknown) {
      if (error instanceof Error && (error as MongoError).code === 11000) {
        throw errors.duplicate('Application from this email for this job');
      }
      throw error;
    }
  }
  
  async getApplicationsByJob(jobId: string, page = 1, limit = 20) {
    const [applications, total] = await Promise.all([
      Application.find({ job_id: jobId }).sort({ created_at: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Application.countDocuments({ job_id: jobId }),
    ]);
    return { data: applications, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
  
  async updateApplicationStatus(id: string, status: 'pending' | 'reviewed' | 'accepted' | 'rejected'): Promise<IApplication> {
    const application = await Application.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
    if (!application) throw errors.notFound('Application');
    return application;
  }
}

export default new ApplicationService();