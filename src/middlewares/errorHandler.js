/**
 * Global error handling middleware.
 * Logs the error and sends a JSON error response.
 */
module.exports = (err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error'
  });
};

