import app from './app';
import { env } from './config/config';
import connectDatabase from './config/database';

const PORT = env.PORT;

// Type guard to check if error is an instance of Error
const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

// Helper to get error message safely
const getErrorMessage = (error: unknown): string => {
  if (isError(error)) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unknown error occurred';
};

const startServer = async () => {
  try {
    await connectDatabase();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} in ${env.NODE_ENV} mode`);
      console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      console.log(`🔄 Received ${signal}, shutting down gracefully...`);
      
      server.close(() => {
        console.log('💤 Server closed');
        process.exit(0);
      });
      
      setTimeout(() => {
        console.error('❌ Could not close connections in time');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
  } catch (error: unknown) {
    // Safe error handling without 'any'
    const message = getErrorMessage(error);
    console.error('❌ Failed to start server:', message);
    process.exit(1);
  }
};

startServer();