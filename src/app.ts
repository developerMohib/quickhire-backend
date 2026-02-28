import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { ApiResponse } from './utils/ApiResponse';

// Routes
import applicationRoutes from './routes/application.route';
import jobRoutes from './routes/job.route';
// Middleware
import { errorHandler } from './middlewares/errorHandler';
import jobRoute from './routes/job.route';
import applicationRoute from './routes/application.route';
import bodyParser from 'body-parser';
import authRoute from './routes/auth.route';

const app = express();

// CORS
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Simple request logging (development only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

app.use('/api', jobRoute);
app.use('/api', applicationRoute);
app.use('/api', authRoute);

// Health check
app.get('/', (_req: Request, res: Response) => {
  res.send('🚀 Quick web server is running');
});
app.get('/health', (req: Request, res: Response) => {
  res
    .status(200)
    .json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
});

// API Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// 404 handler
app.use((req: Request, res: Response, _next: NextFunction) => {
  res
    .status(404)
    .json(ApiResponse.error(`Route ${req.originalUrl} not found`).toJSON());
});

// Global error handler
app.use(errorHandler);

export default app;
