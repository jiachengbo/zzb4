'use strict';

/**
 * Module dependencies
 */
var router = require('express').Router(),
  adminPolicy = require('../policies/admin.server.policy'),
  admin = require('../controllers/admin.server.controller');

module.exports = function (app) {
  // User route registration first. Ref: #713
  require('./users.server.routes.js')(app);

  // Users collection routes
  router.route('/')
    .get(adminPolicy.isAllowed, admin.list)
    .post(adminPolicy.isAllowed, admin.create);

  // Single user routes
  router.route('/:userId')
    .get(adminPolicy.isAllowed, admin.read)
    .put(adminPolicy.isAllowed, admin.update)
    .delete(adminPolicy.isAllowed, admin.delete);

  // Finish by binding the user middleware
  router.param('userId', admin.userByID);

  app.use('/api/users', router);
};
