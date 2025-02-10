const express = require('express');
const logRouter = require('./controllers/logController');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// For potential future JSON parsing (if needed)
app.use(express.json());

// Mount the /logs route
app.use('/logs', logRouter);

// Global error handling middleware
app.use(errorHandler);

module.exports = app;

