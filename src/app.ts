import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { ApiResponse } from './utils/ApiResponse';

// Routes
import applicationRoutes from './routes/application.route'
import jobRoutes from './routes/job.route'
// Middleware
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// CORS
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Simple request logging (development only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

// API Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// 404 handler
app.use((req: Request, res: Response, _next:NextFunction) => {
 res.status(404).json(ApiResponse.error(`Route ${req.originalUrl} not found`).toJSON());
});

// Global error handler
app.use(errorHandler);

export default app;