const mongojs = require('mongojs');
const config = require('../config');

// Promisified wrapper for MongoDB operations
const promisifyDbOperation = (dbCall) => {
  return new Promise((resolve, reject) => {
    dbCall((err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

function connect() {
  return mongojs(config.mongodb.uri);
}

module.exports = {
  connect,
  promisifyDbOperation,
};
