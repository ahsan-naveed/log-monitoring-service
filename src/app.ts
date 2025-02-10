import express, { Application } from 'express';
import logRouter from './controllers/logController';
import errorHandler from './middlewares/errorHandler';

const app: Application = express();

// For potential future JSON parsing (if needed)
app.use(express.json());

// Mount the /logs route
app.use('/logs', logRouter);

// Global error handling middleware
app.use(errorHandler);

export default app;

