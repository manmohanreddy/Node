var mongojs = require('mongojs');
var config = require('../appconfig');

var dbconnectionstring = config.CONNECTION_STRING;

function singletonContainer() {

    var instance = null;

    function DB() {
        var db = mongojs(dbconnectionstring, ['USERS_INFO', 'SESSION_INFO', 'COUNTER', 'EMPLOYEE_INFO']);
        console.log('DB Connected');

        db.USERS_INFO.createIndex({ "Id": 1 }, { unique: true });
        db.COUNTER.insert({ _id: "USERS_INFO", seq: 0 });
        db.COUNTER.insert({ _id: "EMPLOYEE_INFO", seq: 0 });
        return db;


    }
    return {
        getInstance: function () {
            if (instance == null || instance == undefined) {
                instance = new DB();
            }
            return instance;
        }
    }
}

var dbinstance = singletonContainer();

function connect() {
    return dbinstance.getInstance();
}

function getNextSequence(nm, callback) {
    var dbutil = connect();
    dbutil.COUNTER.findAndModify({
        query: { _id: nm },
        update: { $inc: { seq: 1 } },
        new: true
    }, callback);
}

module.exports.connect = connect;
module.exports.getNextSequence = getNextSequence;