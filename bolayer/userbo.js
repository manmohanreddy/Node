const dal = require('../dalayer');
const gid = require('guid');
const httplogger = require('../services/httploggerservice');
const sessionservice = require('../services/sessionservice');

async function getName(req, res, next) {
  try {
    let name = 'default';
    if (req.body && req.body.Name) {
      name = req.body.name;
    } else {
      req.body = {};
      req.body.name = name;
    }

    const request = req.body;
    const result = await dal.userdal.getName(request);

    res.json(httplogger.returnResponse(result));
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    if (!req.body || !req.body.UserName || !req.body.Password) {
      return res.status(400).json(httplogger.returnError(null, 'UserName and Password are required'));
    }

    const request = req.body;
    const result = await dal.userdal.login(request);

    if (!result) {
      return res.status(401).json(httplogger.returnInfo('Authentication', 'Invalid user'));
    }

    const sesid = gid.create();
    const UpdatedDateTime = Date.now();
    result.token = sesid.value;
    result.UpdatedDateTime = UpdatedDateTime;

    await sessionservice.SaveSession(result);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getLocation(req, res, next) {
  try {
    const result = await dal.userdal.getLocation(req);

    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function UpdateUser(req, res, next) {
  try {
    if (!req.body || !req.body.UserName) {
      return res.status(400).json(httplogger.returnError(null, 'UserName is required'));
    }

    const request = req.body;
    const result = await dal.userdal.UpdateUser(request);

    if (result && result.nModified === 0) {
      return res.status(400).json(httplogger.returnError(null, 'NO records found to update'));
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function DeleteUser(req, res, next) {
  try {
    if (!req.body || !req.body.UserName) {
      return res.status(400).json(httplogger.returnError(null, 'UserName is required'));
    }

    const request = req.body;
    const result = await dal.userdal.DeleteUser(request);

    if (result && result.nModified === 0) {
      return res.status(200).json(httplogger.returnResponse('NO records deleted with that ids'));
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function CreateUser(req, res, next) {
  try {
    if (!req.body || !req.body.UserName || !req.body.Password) {
      return res.status(400).json(httplogger.returnError(null, 'UserName and Password are required'));
    }

    const request = req.body;
    const result = await dal.userdal.CreateUser(request);

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  login,
  getName,
  getLocation,
  UpdateUser,
  DeleteUser,
  CreateUser,
};