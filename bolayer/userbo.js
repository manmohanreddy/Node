var dal = require('../dalayer');
var gid = require('guid');
var httplogger = require('../services/httploggerservice');
var sessionservice = require('../services/sessionservice')

function getName(req, res, callback) {
    var name = "default";
    if (req.body != null && req.body.Name != null)
        name = req.body.name;
    else {
        req.body = {};
        req.body.name = name;
    }

    var request = req.body;
    dal.userdal.getName(request, function (err, result) {
        if (err) {
            return res.status(500).json(httplogger.returnError(err, "Error calling getName"));
        }
        else {
            res.json(httplogger.returnResponse(result));
        }
    })
}

function login(req, res, callback) {
    var request = req.body;
    dal.userdal.login(request, function (err, result) {
        if (err) {
            return res.status(500).json(httplogger.returnError(err, "Error calling login"));
        }
        else {
            if (result) {
                var sesid = gid.create();
                var UpdatedDateTime = Date.now;
                result.token = sesid.value;
                result.UpdatedDateTime = UpdatedDateTime;
                sessionservice.SaveSession(result, function (err, output) {
                    if (err == null) {
                        res.json(result);
                    }
                    else {
                        return res.status(500).json(httplogger.returnError(err, "Error saving sessioninfo"));
                    }
                });
            }
            else {
                return res.status(401).json(httplogger.returnInfo('Authentication', 'Invalid user'));
            }
        }
    })
}

function getLocation(req, res, callback) {
    dal.userdal.getLocation(req, function (err, result) {
        if (err) {
            return res.status(500).json(httplogger.returnError(err, "Error calling getLocation"));
        }
        else {
            res.json(result);
        }
    })
}

function UpdateUser(req, res, callback) {
    var request = req.body;
    dal.userdal.UpdateUser(request, function (err, result) {
        if (err) {
            return res.status(500).json(httplogger.returnError(err, "Error Updating user"));
        } else if (result && result.nModified == 0) {
            return res.status(400).json(httplogger.returnResponse(err, "NO records found to update"));
        }
        else {
            res.json(result);
        }
    })
}

function DeleteUser(req, res, callback) {
    var request = req.body;
    dal.userdal.DeleteUser(request, function (err, result) {
        if (err) {
            return res.status(500).json(httplogger.returnError(err, "Error deleting user"));
        } else if (result && result.nModified == 0) {
            return res.status(200).json(httplogger.returnResponse(err, "NO records deleted with that ids"));
        }
        else {
            res.json(result);
        }
    })
}

function CreateUser(req, res, callback) {
    var request = req.body;
    dal.userdal.CreateUser(request, function (err, result) {
        if (err) {
            return res.status(500).json(httplogger.returnError(err, "Error creating user"));
        }
        else {
            res.json(result);
        }
    })
}

module.exports.login = login;
module.exports.getName = getName;
module.exports.getLocation = getLocation;
module.exports.UpdateUser = UpdateUser;
module.exports.DeleteUser = DeleteUser;
module.exports.CreateUser = CreateUser;