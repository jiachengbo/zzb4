'use strict';

/**
 * Module dependencies
 */
var appealPolicy = require('../policies/appeal.server.policy'),
  appeal = require('../controllers/appeal.server.controller');

module.exports = function (app) {
  // Appeal collection routes
  app.route('/api/appeal').all(appealPolicy.isAllowed)
    .get(appeal.list)
    .post(appeal.create);
  // Single appeal routes
  app.route('/api/appeal/:appealId').all(appealPolicy.isAllowed)
    .get(appeal.read)
    .post(appeal.update)
    .delete(appeal.delete);

  // Finish by binding the appeal middleware
  app.param('appealId', appeal.appealByID);
};
