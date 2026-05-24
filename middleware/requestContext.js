const { v4: uuidv4 } = require('uuid');
const logger = require('../services/logger');

// Middleware to inject request ID and logger into each request
const requestContext = (req, res, next) => {
  // Generate or use existing request ID
  req.id = req.headers['x-request-id'] || uuidv4();
  req.startTime = Date.now();

  // Attach logger to request with context
  req.logger = logger.child({
    requestId: req.id,
    method: req.method,
    path: req.path,
  });

  // Log request
  req.logger.info('Incoming request');

  // Log response when it finishes
  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    req.logger.info('Request completed', {
      statusCode: res.statusCode,
      duration: duration + 'ms',
    });
  });

  // Include request ID in response headers
  res.setHeader('X-Request-ID', req.id);

  next();
};

module.exports = requestContext;
