const dbutil = require('./dbutil');
const url = require('url');
const logger = require('../services/logger');

async function getEmployeeById(req) {
  logger.debug('getEmployeeById called', { url: req.url });

  const urlParts = url.parse(req.url, true);
  const params = urlParts.query;
  const employeeId = Number(params.Id);

  return new Promise((resolve, reject) => {
    const dbobj = dbutil.connect();
    dbobj.EMPLOYEE_INFO.find({ EmployeeId: employeeId }, (err, result) => {
      if (err) {
        logger.error('getEmployeeById failed', { employeeId, error: err.message });
        reject(err);
      } else {
        logger.info('Employee retrieved', { employeeId });
        resolve(result && result.length > 0 ? result[0] : null);
      }
    });
  });
}

async function getAllEmployees(req) {
  logger.debug('getAllEmployees called');

  return new Promise((resolve, reject) => {
    const dbobj = dbutil.connect();
    dbobj.EMPLOYEE_INFO.find({ IsActive: true }, (err, result) => {
      if (err) {
        logger.error('getAllEmployees failed', { error: err.message });
        reject(err);
      } else {
        logger.info('All employees retrieved', { count: result ? result.length : 0 });
        resolve(result || []);
      }
    });
  });
}

async function getByEmployeeName(req) {
  logger.debug('getByEmployeeName called', { url: req.url });

  const urlParts = url.parse(req.url, true);
  const params = urlParts.query;

  return new Promise((resolve, reject) => {
    const dbobj = dbutil.connect();
    dbobj.EMPLOYEE_INFO.find({ EmployeeName: params.name }, (err, result) => {
      if (err) {
        logger.error('getByEmployeeName failed', { name: params.name, error: err.message });
        reject(err);
      } else {
        logger.info('Employees retrieved by name', { name: params.name, count: result ? result.length : 0 });
        resolve(result || []);
      }
    });
  });
}

async function CreateEmployee(req) {
  logger.debug('CreateEmployee called', { name: req.name });

  const dbobj = dbutil.connect();

  return new Promise((resolve, reject) => {
    dbobj.EMPLOYEE_INFO.find({ EmployeeName: req.name }, (err, result) => {
      if (err) {
        logger.error('CreateEmployee check failed', { name: req.name, error: err.message });
        reject(err);
      } else if (result && result.length > 0) {
        logger.warn('CreateEmployee attempted on existing employee', { name: req.name });
        reject(new Error(`Employee with name ${req.name} already exists`));
      } else {
        dbobj.EMPLOYEE_INFO.insert(req, (err, result) => {
          if (err) {
            logger.error('CreateEmployee insert failed', { name: req.name, error: err.message });
            reject(err);
          } else {
            logger.info('Employee created', { name: req.name });
            resolve(result);
          }
        });
      }
    });
  });
}

async function UpdateEmployee(req) {
  logger.debug('UpdateEmployee called', { employeeId: req.EmployeeId });

  return new Promise((resolve, reject) => {
    const dbobj = dbutil.connect();
    dbobj.EMPLOYEE_INFO.update(
      { EmployeeId: Number(req.EmployeeId) },
      { $set: req },
      (err, result) => {
        if (err) {
          logger.error('UpdateEmployee failed', { employeeId: req.EmployeeId, error: err.message });
          reject(err);
        } else {
          logger.info('Employee updated', { employeeId: req.EmployeeId });
          resolve(result);
        }
      }
    );
  });
}

async function DeleteEmployee(req) {
  logger.debug('DeleteEmployee called', { employeeId: req.EmployeeId });

  return new Promise((resolve, reject) => {
    const dbobj = dbutil.connect();
    dbobj.EMPLOYEE_INFO.remove(
      { EmployeeId: Number(req.EmployeeId) },
      (err, result) => {
        if (err) {
          logger.error('DeleteEmployee failed', { employeeId: req.EmployeeId, error: err.message });
          reject(err);
        } else {
          logger.info('Employee deleted', { employeeId: req.EmployeeId });
          resolve(result);
        }
      }
    );
  });
}

module.exports.getEmployeeById = getEmployeeById;
module.exports.getAllEmployees = getAllEmployees;
module.exports.getByEmployeeName = getByEmployeeName;
module.exports.CreateEmployee = CreateEmployee;
module.exports.UpdateEmployee = UpdateEmployee;
module.exports.DeleteEmployee = DeleteEmployee;
