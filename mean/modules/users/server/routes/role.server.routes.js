'use strict';

/**
 * Module dependencies
 */
var router = require('express').Router(),
  rolePolicy = require('../policies/role.server.policy'),
  role = require('../controllers/role.server.controller');

module.exports = function (app) {
  // Role collection routes
  router.route('/').all(rolePolicy.isAllowed)
    .get(role.list)
    .post(role.create);
  // Single role routes
  router.route('/:roleId').all(rolePolicy.isAllowed)
    .get(role.read)
    .put(role.update)
    .delete(role.delete);

  // Finish by binding the role middleware
  router.param('roleId', role.roleByID);

  app.use('/api/role', router);
};
