const dal = require('../dalayer');
const gid = require('guid');
const httplogger = require('../services/httploggerservice');
const sessionservice = require('../services/sessionservice');

async function getEmployeeByName(req, res, next) {
  try {
    if (!req.body || !req.body.Name) {
      return res.status(400).json(httplogger.returnError(null, 'Name is required in request body'));
    }

    const request = req.body;
    const result = await dal.employeedal.getByEmployeeName(request);

    res.json(httplogger.returnResponse(result));
  } catch (err) {
    next(err);
  }
}

async function getEmployeeById(req, res, next) {
  try {
    const result = await dal.employeedal.getEmployyeByID(req);

    if (!result) {
      return res.status(404).json(httplogger.returnError(null, 'Employee not found with that Id'));
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getAllEmployees(req, res, next) {
  try {
    const result = await dal.employeedal.getAllEmployees(req);

    if (!result) {
      return res.status(404).json(httplogger.returnError(null, 'No employees found'));
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function UpdateEmployee(req, res, next) {
  try {
    if (!req.body || !req.body.EmployeeId) {
      return res.status(400).json(httplogger.returnError(null, 'EmployeeId is required'));
    }

    const request = req.body;
    const result = await dal.employeedal.UpdateEmployee(request);

    if (result && result.nModified === 0) {
      return res.status(400).json(httplogger.returnError(null, 'NO records found to update'));
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function DeleteEmployee(req, res, next) {
  try {
    if (!req.body || !req.body.EmployeeId) {
      return res.status(400).json(httplogger.returnError(null, 'EmployeeId is required'));
    }

    const request = req.body;
    const result = await dal.employeedal.DeleteEmployee(request);

    if (result && result.nModified === 0) {
      return res.status(200).json(httplogger.returnResponse('NO records deleted with that id'));
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function CreateEmployee(req, res, next) {
  try {
    if (!req.body || !req.body.EmployeeName) {
      return res.status(400).json(httplogger.returnError(null, 'EmployeeName is required'));
    }

    const request = req.body;
    const result = await dal.employeedal.CreateEmployee(request);

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getEmployeeByName,
  getEmployeeById,
  getAllEmployees,
  UpdateEmployee,
  DeleteEmployee,
  CreateEmployee,
};