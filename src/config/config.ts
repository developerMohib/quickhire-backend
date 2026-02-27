import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().min(1),
  ADMIN_TOKEN: z.string().min(10),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
});

export type Env = z.infer<typeof envSchema>;

const validateEnv = () => {
  const result = envSchema.safeParse(process.env);
  
  if (!result.success) {
    // 1. Use .issues instead of .errors
    console.error('❌ Environment validation error:');
    
    // 2. Format the errors to be readable (best practice)
    console.error(result.error.format()); 
    
    // OR for a flat array of messages:
    // console.error(result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`));
    
    process.exit(1);
  }
  
  return result.data;
};

export const env = validateEnv();