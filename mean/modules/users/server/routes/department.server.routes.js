'use strict';

/**
 * Module dependencies
 */
var router = require('express').Router(),
  departmentPolicy = require('../policies/department.server.policy'),
  department = require('../controllers/department.server.controller');

module.exports = function (app) {
  // Role collection routes
  router.route('/').all(departmentPolicy.isAllowed)
    .get(department.list)
    .post(department.create);
  // Single department routes
  router.route('/:departmentId').all(departmentPolicy.isAllowed)
    .get(department.read)
    .put(department.update)
    .delete(department.delete);

  // Finish by binding the department middleware
  router.param('departmentId', department.departmentByID);

  app.use('/api/department', router);
};
