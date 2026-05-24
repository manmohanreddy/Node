require('dotenv').config();

// Validate port
const port = parseInt(process.env.PORT || '3501', 10);
if (isNaN(port) || port < 1 || port > 65535) {
  throw new Error(`Invalid PORT: ${process.env.PORT}. Must be a number between 1-65535. Default: 3501`);
}

// Validate log level
const validLogLevels = ['debug', 'info', 'warn', 'error'];
const logLevel = process.env.LOG_LEVEL || 'info';
if (!validLogLevels.includes(logLevel)) {
  throw new Error(`Invalid LOG_LEVEL: ${logLevel}. Must be one of: ${validLogLevels.join(', ')}`);
}

module.exports = {
  // Database
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/demodb',
  },

  // Server
  server: {
    port: port,
    env: process.env.NODE_ENV || 'development',
  },

  // Logging
  logging: {
    level: logLevel,
  },

  // Health checks
  health: {
    readinessTimeout: 5000, // ms to wait for db connection
  },
};
