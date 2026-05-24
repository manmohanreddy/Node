const joi = require('joi');
const { AppError } = require('./errorHandler');

// Validation middleware factory
const validateRequest = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      const err = new AppError(
        `Validation failed: ${error.details[0].message}`,
        'VALIDATION_ERROR',
        400,
        { validationErrors: details }
      );
      return next(err);
    }

    req[source] = value;
    next();
  };
};

// Validation schemas for endpoints
const schemas = {
  // Employee endpoints
  createEmployee: joi.object({
    EmployeeName: joi.string().required().min(1).max(255),
    EmployeeId: joi.number().required().integer().positive(),
    IsActive: joi.boolean().optional().default(true)
  }),

  updateEmployee: joi.object({
    EmployeeId: joi.number().required().integer().positive(),
    EmployeeName: joi.string().optional().min(1).max(255),
    IsActive: joi.boolean().optional()
  }),

  deleteEmployee: joi.object({
    EmployeeId: joi.number().required().integer().positive()
  }),

  getEmployeeById: joi.object({
    Id: joi.number().required().integer().positive()
  }),

  getEmployeeByName: joi.object({
    Name: joi.string().required().min(1).max(255)
  }),

  // User endpoints
  createUser: joi.object({
    UserName: joi.string().required().min(1).max(255),
    Password: joi.string().required().min(6).max(255),
    Email: joi.string().optional().email(),
    Location: joi.string().optional().max(255)
  }),

  login: joi.object({
    name: joi.string().required().min(1).max(255),
    password: joi.string().required().min(1)
  }),

  updateUser: joi.object({
    UserName: joi.string().required().min(1).max(255),
    Email: joi.string().optional().email(),
    Location: joi.string().optional().max(255)
  }),

  deleteUser: joi.object({
    UserName: joi.string().required().min(1).max(255)
  })
};

module.exports = {
  validateRequest,
  schemas
};
