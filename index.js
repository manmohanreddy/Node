const http = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const config = require('./config');
const logger = require('./services/logger');
const healthcheck = require('./services/healthcheck');
const requestContext = require('./middleware/requestContext');
const { errorHandler } = require('./middleware/errorHandler');
const router = require('./routes/routing');
const mongojs = require('mongojs');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '10mb' }));

// Add custom CORS headers (keep existing behavior)
app.use('*', (req, res, callback) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  callback();
});

// Request context middleware (adds request ID and logger)
app.use(requestContext);

// Health check endpoints for Kubernetes
app.get('/health/ready', healthcheck.readiness);
app.get('/health/live', healthcheck.liveness);

// API documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  swaggerOptions: {
    url: '/swagger.json'
  }
}));

// API routes
app.use('/api/v1.0', router);

// Error handler middleware (must be last)
app.use(errorHandler);

// Database connection
let dbConnection = null;
try {
  dbConnection = mongojs(config.mongodb.uri);
  healthcheck.setDatabaseConnected(true);
  logger.info('Connected to MongoDB', { uri: config.mongodb.uri });
} catch (err) {
  logger.error('Failed to connect to MongoDB', { error: err.message });
  healthcheck.setDatabaseConnected(false);
}

// Make db available globally (existing pattern, will refactor in Phase 2)
global.db = dbConnection;

// Start server
const server = http.createServer(app);
const PORT = config.server.port;

server.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`, { port: PORT, env: config.server.env });
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  return () => {
    logger.info(`${signal} received, starting graceful shutdown...`);

    // Stop accepting new requests
    server.close(() => {
      logger.info('Server closed, shutting down process');

      // Close database connection
      if (dbConnection) {
        dbConnection.close();
        logger.info('Database connection closed');
      }

      process.exit(0);
    });

    // Force shutdown after 30 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after 30 second timeout');
      process.exit(1);
    }, 30000);
  };
};

process.on('SIGTERM', gracefulShutdown('SIGTERM'));
process.on('SIGINT', gracefulShutdown('SIGINT'));

// Catch uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', { error: err.message, stack: err.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason: reason, promise: promise });
  process.exit(1);
});
