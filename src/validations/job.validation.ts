import { z } from 'zod';

export const jobValidation = {
  create: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters').trim(),
    company: z.string().min(1, 'Company name is required').trim(),
    location: z.string().min(1, 'Location is required').trim(),
    category: z.string().min(1, 'Category is required').trim(),
    description: z.string().min(1, 'Description is required').max(5000, 'Description cannot exceed 5000 characters'),
    requirements: z.array(z.string()).optional(),
    salary_range: z.object({
      min: z.number().min(0).optional(),
      max: z.number().min(0).optional(),
      currency: z.enum(['USD', 'EUR', 'GBP', 'OTHER']).default('USD'),
      period: z.enum(['hourly', 'daily', 'monthly', 'yearly']).default('yearly'),
    }).optional(),
    employment_type: z.enum(['full-time', 'part-time', 'contract', 'internship']).default('full-time'),
    remote: z.boolean().default(false),
    application_deadline: z
    .union([
      z.date(),
      z.string().transform((val) => new Date(val))
    ])
    .optional()
    .refine((val) => !val || val > new Date(), {
      message: 'Application deadline must be in the future',
    }),
  }),
  
  update: z.object({
    title: z.string().max(200).trim().optional(),
    company: z.string().trim().optional(),
    location: z.string().trim().optional(),
    category: z.string().optional(),
    description: z.string().max(5000).optional(),
    requirements: z.array(z.string()).optional(),
    salary_range: z.object({
      min: z.number().min(0).optional(),
      max: z.number().min(0).optional(),
      currency: z.enum(['USD', 'EUR', 'GBP', 'OTHER']).optional(),
      period: z.enum(['hourly', 'daily', 'monthly', 'yearly']).optional(),
    }).optional(),
    employment_type: z.enum(['full-time', 'part-time', 'contract', 'internship']).optional(),
    remote: z.boolean().optional(),
    application_deadline: z.date().optional().refine((val) => !val || val > new Date(), {
      message: 'Application deadline must be in the future',
    }),
  }),
  
  listQuery: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().trim().optional(),
    category: z.string().optional(),
    location: z.string().optional(),
    remote: z.coerce.boolean().optional(),
    employment_type: z.enum(['full-time', 'part-time', 'contract', 'internship']).optional(),
    sortBy: z.enum(['created_at', 'title', 'company']).default('created_at'),
    order: z.enum(['asc', 'desc']).default('desc'),
  }),
};

// Export inferred types for use in controllers
export type JobCreateInput = z.infer<typeof jobValidation.create>;
export type JobUpdateInput = z.infer<typeof jobValidation.update>;
export type JobListQuery = z.infer<typeof jobValidation.listQuery>;