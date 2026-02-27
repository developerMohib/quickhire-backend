import { z } from 'zod';

export const applicationValidation = {
  create: z.object({
    job_id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid job ID format'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters').trim(),
    email: z.string().email('Please enter a valid email').toLowerCase().trim(),
    resume_link: z.string().url('Resume link must be a valid URL').trim(),
    cover_note: z.string().max(2000, 'Cover note cannot exceed 2000 characters').trim().optional(),
  }),
};