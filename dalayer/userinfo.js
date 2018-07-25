
var dbutil = require('../dalayer/dbutil')
var sessionservice = require('../services/sessionservice')

var async = require("async");

//Event emitter related code
var events = require("events");
var eventEmitter = new events.EventEmitter();

var sendEmail = function sentEmail(){
    console.log("Email sent successfully");
}

var xyz = function xyz(){
    console.log("xyz function called");
}

eventEmitter.addListener("connection", sendEmail);
eventEmitter.on('connection', xyz);
eventEmitter.emit('connection');
eventEmitter.removeListener("connection", sendEmail);
eventEmitter.emit('connection');


function login(req, callback) {
    var dbobj = dbutil.connect();
    var buff = new Buffer(req.password);
    var pwd = buff.toString('base64');
    dbobj.USERS_INFO.findOne({ name: req.name, password: pwd, IsActive: true }, { Id: 1, name: 1, RoleId: 1 }, callback);
}

function getName(req, callback) {
    //callback(null, { "Message": "My name is :" + req.name });

    var dbobj = dbutil.connect();
    dbobj.USERS_INFO.find({ IsActive: true }, { _id: 0, IsActive: 0 }, callback);
}

function getLocation(req, callback) {
    //callback(null, { "Message": "My name is :" + req.name });
    var dbobj = dbutil.connect();
    dbobj.USERS_INFO.find({ IsActive: true },
        {
            "location": 1.0
        }, callback);
}

function CreateUser(req, callback) {
    var dbobj = dbutil.connect();
    var buff = new Buffer('welcome');
    var pwd = buff.toString('base64');
//synchronous Programming
    new Promise(function (resolve, reject) {
        dbutil.getNextSequence('USERS_INFO', function (err, result) {
            if (err == null) {
                dbobj.USERS_INFO.insert({
                    Id: result.seq,
                    name: req.name,
                    password: pwd,
                    location: req.location,
                    RoleId: req.roleid,
                    IsActive: true
                },
                    //callback
                    resolve(result)
                )
            } else {
                //callback(err, null);
                reject(err);
            }
        });
    }).then(function (rec) {
        callback(null, rec);
    }).catch(function (err) {
        callback(err, null);
    })
}

function UpdateUser(req, callback) {
    var dbobj = dbutil.connect();
    dbobj.USERS_INFO.update({
        Id: req.Id
    }, {
            $set: {
                name: req.name,
                location: req.location
            }
        }, callback)
}

function DeleteUser(req, callback) {
    var dbobj = dbutil.connect();
    dbobj.USERS_INFO.update({
        Id: { $in: req.Ids }
    }, {
            $set: {
                IsActive: false
            }
        }, callback)
}

//async calls
function bulkupdate(req, callback) {
    var students = req.students;
    async.each(students, function (student, next) {
        updatestudent(student, function () {
            next();
        });
    }, function (err) {
        callback();
    })
}

module.exports.login = login;
module.exports.getName = getName;
module.exports.getLocation = getLocation;

module.exports.CreateUser = CreateUser;
module.exports.DeleteUser = DeleteUser;
module.exports.UpdateUser = UpdateUser;
