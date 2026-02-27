import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  category: string;
  description: string;
  requirements?: string[];
  salary_range?: {
    min: number;
    max: number;
    currency: string;
    period: 'hourly' | 'daily' | 'monthly' | 'yearly';
  };
  employment_type: 'full-time' | 'part-time' | 'contract' | 'internship';
  remote: boolean;
  application_deadline?: Date;
  created_at: Date;
  updated_at: Date;
  isExpired(): boolean;
}

const jobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      index: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      index: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Engineering', 'Design', 'Marketing', 'Sales',
        'Support', 'Finance', 'HR', 'Other',
      ],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    requirements: { type: [String], default: [] },
    salary_range: {
      min: { type: Number, min: 0 },
      max: { type: Number, min: 0 },
      currency: { type: String, default: 'USD', enum: ['USD', 'EUR', 'GBP', 'OTHER'] },
      period: { 
        type: String, 
        default: 'yearly',
        enum: ['hourly', 'daily', 'monthly', 'yearly']
      },
    },
    employment_type: {
      type: String,
      required: true,
      enum: ['full-time', 'part-time', 'contract', 'internship'],
      default: 'full-time',
    },
    remote: { type: Boolean, default: false, index: true },
    application_deadline: {
      type: Date,
      validate: {
        validator: function(this: IJob, value: Date) {
          return !value || value > new Date();
        },
        message: 'Application deadline must be in the future',
      },
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { 
      virtuals: true, 
      transform: (_, ret) => {
        // ✅ Use destructuring instead of delete (type-safe)
        const { __v, ...rest } = ret.toObject();
        return rest;
      }
    },
    toObject: { 
      virtuals: true,
      transform: (_, ret) => {
        // ✅ Use destructuring instead of delete (type-safe)
        const { __v, ...rest } = ret.toObject();
        return rest;
      }
    },
  }
);

// Text index for search
jobSchema.index({ title: 'text', company: 'text', description: 'text' });

// Instance method
jobSchema.methods.isExpired = function(): boolean {
  return this.application_deadline ? new Date() > this.application_deadline : false;
};

const Job: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>('Job', jobSchema);
export default Job;