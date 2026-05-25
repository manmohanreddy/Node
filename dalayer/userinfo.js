const dbutil = require('../dalayer/dbutil');
const sessionservice = require('../services/sessionservice');
const url = require('url');

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


async function login(req) {
    const dbobj = dbutil.connect();
    const password = req.Password || req.password;
    const username = req.UserName || req.name;

    if (!password) {
        throw new Error('Password is required');
    }

    const buff = Buffer.from(password);
    const pwd = buff.toString('base64');

    return new Promise((resolve, reject) => {
        dbobj.USERS_INFO.findOne(
            { name: username, password: pwd, IsActive: true },
            { Id: 1, name: 1, RoleId: 1 },
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        );
    });
}

async function getName(req) {
    const dbobj = dbutil.connect();

    return new Promise((resolve, reject) => {
        dbobj.USERS_INFO.find(
            { IsActive: true },
            { _id: 0, IsActive: 0 },
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result || []);
                }
            }
        );
    });
}

async function getLocation(req) {
    const dbobj = dbutil.connect();

    return new Promise((resolve, reject) => {
        dbobj.USERS_INFO.find(
            { IsActive: true },
            { "location": 1.0 },
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result || []);
                }
            }
        );
    });
}

async function getUserByName(req) {
    const urlParts = url.parse(req.url, true);
    const params = urlParts.query;

    return new Promise((resolve, reject) => {
        const dbobj = dbutil.connect();
        dbobj.USER_INFO.find({ UserName: params.name }, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result && result.length > 0 ? result[0] : null);
            }
        });
    });
}

async function CreateUser(req) {
    const dbobj = dbutil.connect();
    const buff = Buffer.from(req.Password || 'welcome');
    const pwd = buff.toString('base64');

    return new Promise((resolve, reject) => {
        dbutil.getNextSequence('USERS_INFO', (err, result) => {
            if (err) {
                reject(err);
            } else {
                dbobj.USERS_INFO.insert({
                    Id: result.seq,
                    name: req.UserName,
                    password: pwd,
                    location: req.Location || '',
                    RoleId: req.RoleId || 2,
                    IsActive: true,
                    CreatedDate: new Date()
                }, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            }
        });
    });
}

async function UpdateUser(req) {
    const dbobj = dbutil.connect();

    return new Promise((resolve, reject) => {
        dbobj.USERS_INFO.update({
            Id: req.Id
        }, {
            $set: {
                name: req.name,
                location: req.location,
                UpdatedDate: new Date()
            }
        }, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

async function DeleteUser(req) {
    const dbobj = dbutil.connect();

    return new Promise((resolve, reject) => {
        dbobj.USERS_INFO.update({
            Id: { $in: req.Ids }
        }, {
            $set: {
                IsActive: false,
                DeletedDate: new Date()
            }
        }, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
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
module.exports.getUserByName = getUserByName;
module.exports.CreateUser = CreateUser;
module.exports.DeleteUser = DeleteUser;
module.exports.UpdateUser = UpdateUser;
