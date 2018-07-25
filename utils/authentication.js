var dbutil = require('../dalayer/dbutil');
var dbUserInfo = require('../dalayer/userinfo')
var httploggerservice = require('../services/httploggerservice');
var sessionservice = require('../services/sessionservice')

function validateSession(req, res, callback) {
    sessionservice.validateSession(req, function (err, result) {
        if (err) {
            if (err.message)
                return res.status(400).json(httploggerservice.returnError(err, err.message));
            else
                return res.status(400).json(httploggerservice.returnError("Token validation failed", "Invalid Token!"));
        }
        else if (result) {
            callback();
        }
        else {
            return res.status(400).json(httploggerservice.returnError("Session validation failed", "Invalid Session!"));
        }
    });
}

function IsAutherized(roles) {
    return function (req, res, callback) {
        if (roles.indexOf(Number(req.headers.roleid)) >= 0)
            return callback();
        return res.status(401).json(httploggerservice.returnError({err: true}, "Un authorized"));
    }
}

function IsAuthenticated() {
    return validateSession;
}

function ensureRole(roles) {
    return IsAutherized(roles);
}
module.exports.IsAuthenticated = IsAuthenticated;
module.exports.ensureRole = ensureRole;