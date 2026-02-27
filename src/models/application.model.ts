/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IApplication extends Document {
  job_id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  resume_link: string;
  cover_note?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  created_at: Date;
  updated_at: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    job_id: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job reference is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Applicant name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
      index: true,
    },
    resume_link: {
      type: String,
      required: [true, 'Resume link is required'],
      trim: true,
      validate: {
        validator: (v: string) => /^https?:\/\/.+/.test(v),
        message: 'Resume link must be a valid URL (http/https)',
      },
    },
    cover_note: {
      type: String,
      trim: true,
      maxlength: [2000, 'Cover note cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'accepted', 'rejected'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { 
      virtuals: true, 
      transform: (_, ret) => {
        // Cast to any to allow delete operations
        const doc = ret as any;
        delete doc.__v;
        delete doc.job_id;
        return doc;
      }
    },
    toObject: { 
      virtuals: true,
      transform: (_, ret) => {
        const doc = ret as any;
        delete doc.__v;
        delete doc.job_id;
        return doc;
      }
    },
  }
);

applicationSchema.index({ job_id: 1, email: 1 }, { unique: true });

const Application: Model<IApplication> = 
  mongoose.models.Application || mongoose.model<IApplication>('Application', applicationSchema);

export default Application;