var dal = require('../dalayer');
var gid = require('guid');
var httplogger = require('../services/httploggerservice');
var sessionservice = require('../services/sessionservice');


function getEmployeeByName(req, res, callback) {
    if (req.body != null && req.body.Name != null) {
        var request = req.body;
        dal.employeedal.getByEmployeeName(request, function (err, result) {
            if (err) {
                return res.status(500).json(httplogger.returnError(err, "Error calling getEmployeeByName"));
            }
            else {
                res.json(httplogger.returnResponse(result));
            }
        })
    }
}

function getEmployeeById(req, res, callback) {
    dal.employeedal.getEmployyeByID(req, function (err, result) {
        if (err) {
            return res.status(500).json(httplogger.returnError(err, "Error calling getEmployeeById"));
        }
        else if(result == null && !err){
            return res.status(404).json(httplogger.returnError(err, "Employee not found with that Id"));
        }
        else {
            res.json(result);
        }
    })
}

function getAllEmployees(req, res, callback) {
    dal.employeedal.getAllEmployees(req, function (err, result) {
        if (err) {
            return res.status(500).json(httplogger.returnError(err, "Error calling getEmployeeById"));
        }
        else if(result == null && !err){
            return res.status(404).json(httplogger.returnError(err, "Employee not found with that Id"));
        }
        else {
            res.json(result);
        }
    })
}

function UpdateEmployee(req, res, callback) {
    var request = req.body;
    dal.employeedal.UpdateEmployee(request, function (err, result) {
        if (err) {
            return res.status(500).json(httplogger.returnError(err, "Error Updating Employee"));
        } else if (result && result.nModified == 0) {
            return res.status(400).json(httplogger.returnResponse(err, "NO records found to update"));
        }
        else {
            res.json(result);
        }
    })
}

function DeleteEmployee(req, res, callback) {
    var request = req.body;
    dal.employeedal.DeleteEmployee(request, function (err, result) {
        if (err) {
            return res.status(500).json(httplogger.returnError(err, "Error deleting Employee"));
        } else if (result && result.nModified == 0) {
            return res.status(200).json(httplogger.returnResponse(err, "NO records deleted with that id"));
        }
        else {
            res.json(result);
        }
    })
}

function CreateEmployee(req, res, callback) {
    var request = req.body;
    dal.employeedal.CreateEmployee(request, res, function (err, result) {
        if (err) {
            return res.status(500).json(httplogger.returnError(err, "Error creating Employee"));
        }
        else {
            res.json(result);
        }
    })
}

module.exports.getEmployeeByName = getEmployeeByName;
module.exports.getEmployeeById = getEmployeeById;
module.exports.UpdateEmployee = UpdateEmployee;
module.exports.DeleteEmployee = DeleteEmployee;
module.exports.CreateEmployee = CreateEmployee;
module.exports.getAllEmployees = getAllEmployees;