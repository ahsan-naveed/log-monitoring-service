/**
 * Global error handling middleware.
 * Logs the error and sends a JSON error response.
 */
import { Request, Response, NextFunction } from 'express';

export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error'
  });
}

