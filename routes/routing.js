var express = require('express');
var router = express.Router();
var bo = require('../bolayer');
var authenticate = require('../utils/authentication')

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/login", asyncHandler(bo.userbo.login));

router.get("/GetName", authenticate.IsAuthenticated(), authenticate.ensureRole([1, 2]), asyncHandler(bo.userbo.getName));

router.get("/GetLocation", authenticate.IsAuthenticated(), authenticate.ensureRole([1, 2]), asyncHandler(bo.userbo.getLocation));

router.put("/UpdateUser", authenticate.IsAuthenticated(), authenticate.ensureRole([1]), asyncHandler(bo.userbo.UpdateUser));

router.post("/DeleteUser", authenticate.IsAuthenticated(), authenticate.ensureRole([1]), asyncHandler(bo.userbo.DeleteUser));

router.post("/CreateUser", asyncHandler(bo.userbo.CreateUser));

router.get("/Employee/GetByname", authenticate.IsAuthenticated(), authenticate.ensureRole([1, 2]), asyncHandler(bo.employeebo.getEmployeeByName));

router.get("/Employee/GetById", authenticate.IsAuthenticated(), authenticate.ensureRole([1, 2]), asyncHandler(bo.employeebo.getEmployeeById));

router.get("/Employee/GetAllEmployees", authenticate.IsAuthenticated(), authenticate.ensureRole([1, 2]), asyncHandler(bo.employeebo.getAllEmployees));

router.put("/Employee/UpdateEmployee", authenticate.IsAuthenticated(), authenticate.ensureRole([1]), asyncHandler(bo.employeebo.UpdateEmployee));

router.put("/Employee/DeleteEmployee", authenticate.IsAuthenticated(), authenticate.ensureRole([1]), asyncHandler(bo.employeebo.DeleteEmployee));

router.post("/Employee/InsertEmployee", authenticate.IsAuthenticated(), authenticate.ensureRole([1]), asyncHandler(bo.employeebo.CreateEmployee));

module.exports = router;

