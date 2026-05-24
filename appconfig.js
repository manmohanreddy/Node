const config = require('./config');

module.exports = {
  mongodb: {
    uri: config.mongodb.uri,
  },
  server: {
    port: config.server.port,
    env: config.server.env,
  },
  logging: {
    level: config.logging.level,
  },
};