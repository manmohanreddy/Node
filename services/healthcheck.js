const config = require('../config');
let dbConnected = false;

// Set this after database is connected in index.js
const setDatabaseConnected = (connected) => {
  dbConnected = connected;
};

// Readiness probe: check if db is connected
const readiness = (req, res) => {
  if (dbConnected) {
    return res.status(200).json({ status: 'ready', timestamp: new Date().toISOString() });
  }
  return res.status(503).json({ status: 'not_ready', reason: 'database_unavailable' });
};

// Liveness probe: check if process is responding
const liveness = (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();

  return res.status(200).json({
    status: 'alive',
    uptime: Math.round(uptime),
    memory: {
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
    },
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  readiness,
  liveness,
  setDatabaseConnected,
};
