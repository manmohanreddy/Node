var express = require('express');
var router = express.Router();
var bo = require('../bolayer');
var authenticate = require('../utils/authentication')

router.post("/login", bo.userbo.login);

router.get("/GetName", authenticate.IsAuthenticated(), authenticate.ensureRole([1, 2]), bo.userbo.getName);

router.get("/GetLocation", authenticate.IsAuthenticated(), authenticate.ensureRole([1, 2]), bo.userbo.getLocation);

router.put("/UpdateUser", authenticate.IsAuthenticated(), authenticate.ensureRole([1]), bo.userbo.UpdateUser);

router.post("/DeleteUser", authenticate.IsAuthenticated(), authenticate.ensureRole([1]), bo.userbo.DeleteUser);

router.post("/CreateUser", bo.userbo.CreateUser);

router.get("/Employee/GetByname", authenticate.IsAuthenticated(), authenticate.ensureRole([1, 2]), bo.employeebo.getEmployeeByName);

router.get("/Employee/GetById", bo.employeebo.getEmployeeById);

router.get("/Employee/GetAllEmployees", bo.employeebo.getAllEmployees);

router.put("/Employee/UpdateEmployee", bo.employeebo.UpdateEmployee);

router.put("/Employee/DeleteEmployee", bo.employeebo.DeleteEmployee);

router.post("/Employee/InsertEmployee", bo.employeebo.CreateEmployee);

module.exports = router;

