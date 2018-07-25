
var dbutil = require('../dalayer/dbutil')
var sessionservice = require('../services/sessionservice')
var url = require("url");

function getEmployyeByID(req, callback) {
    //callback(null, { "Message": "My name is :" + req.name });
    var urlParts = url.parse(req.url, true);
    var params = urlParts.query;

    var dbobj = dbutil.connect();
    dbobj.EMPLOYEE_INFO.find({
        "EmployeeId": Number(params.Id)
    }, callback);
}

function getAllEmployees(req, callback) {
  
    var dbobj = dbutil.connect();
    dbobj.EMPLOYEE_INFO.find({IsActive: true }, callback);
}

function getByEmployeeName(req, callback) {
    //callback(null, { "Message": "My name is :" + req.name });
    var dbobj = dbutil.connect();
    var urlParts = url.parse(req.url, true);
    var params = urlParts.query;
    dbobj.EMPLOYEE_INFO.find(
        {
            "EmployeeName": params.name
        }, callback);
}

function CreateEmployee(req, res, callback) {
    var dbobj = dbutil.connect();
    //synchronous Programming
    new Promise(function (resolve, reject) {
        var record = dbobj.EMPLOYEE_INFO.find(
            {
                "EmployeeName": req.name
            });
        if (record && record.EmployeeId&& record.EmployeeId > 0) {
            return res.status(409).json({ err: true, message: "Record already exists with the same name" });
        }
        dbutil.getNextSequence('EMPLOYEE_INFO', function (err, result) {
            if (err == null) {
                dbobj.EMPLOYEE_INFO.insert({
                    EmployeeId: result.seq,
                    EmployeeName: req.name,
                    Job: req.job,
                    Location: req.location,
                    Status: req.status,
                    Salary: req.salary,
                    hours: req.hours,
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
    }).then(function (result) {
        return res.status(201).json({ err: false, message: "Employee Created Successfully", output: { EmployeeId: result.seq } });
        //callback(null, rec);
    }).catch(function (err) {
        return res.status(500).json({ err: true, message: err.message });
        //callback(err, null);
    })
}

function UpdateEmployee(req, callback) {
    var dbobj = dbutil.connect();
    dbobj.EMPLOYEE_INFO.update({
        EmployeeId: Number(req.id)
    }, {
            $set: {
                Salary: req.salary,
                hours: req.hours
            }
        }, callback)
}

function DeleteEmployee(req, callback) {
    var dbobj = dbutil.connect();
    dbobj.EMPLOYEE_INFO.update({
        EmployeeId: Number(req.id)
    }, {
            $set: {
                IsActive: false
            }
        }, callback)
}


module.exports.getEmployyeByID = getEmployyeByID;
module.exports.getByEmployeeName = getByEmployeeName;

module.exports.CreateEmployee = CreateEmployee;
module.exports.DeleteEmployee = DeleteEmployee;
module.exports.UpdateEmployee = UpdateEmployee;
module.exports.getAllEmployees = getAllEmployees;
