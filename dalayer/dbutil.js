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

function getNextSequence(sequenceName, callback) {
  const db = connect();
  db.counters.findAndModify(
    { query: { _id: sequenceName }, update: { $inc: { seq: 1 } }, new: true, upsert: true },
    (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    }
  );
}

module.exports = {
  connect,
  promisifyDbOperation,
  getNextSequence,
};
