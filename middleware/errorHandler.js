const logger = require('../services/logger');

// Standard error response format
const errorResponse = (err, requestId) => {
  const errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';
  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred';

  const response = {
    error: message,
    errorCode,
    requestId,
  };

  // Include details if present (e.g., validation errors)
  if (err.details) {
    response.details = err.details;
  }

  return response;
};

// Express error handler middleware (must have 4 parameters)
const errorHandler = (err, req, res, next) => {
  const requestId = req.id || 'unknown';

  // Log the error with context
  req.logger?.error('Request failed', {
    error: err.message,
    errorCode: err.errorCode || 'UNKNOWN',
    statusCode: err.statusCode || 500,
    stack: err.stack,
  });

  // Determine status code
  const statusCode = err.statusCode || 500;

  // Send error response
  res.status(statusCode).json(errorResponse(err, requestId));
};

// Helper to create app errors
class AppError extends Error {
  constructor(message, errorCode = 'INTERNAL_ERROR', statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
  }
}

module.exports = {
  errorHandler,
  AppError,
};
