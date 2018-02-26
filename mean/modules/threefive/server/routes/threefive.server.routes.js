'use strict';

/**
 * Module dependencies
 */
var threefivePolicy = require('../policies/threefive.server.policy'),
  threefive = require('../controllers/threefive.server.controller');

module.exports = function (app) {
  // Threefive collection routes
  app.route('/api/threefive').all(threefivePolicy.isAllowed)
    .get(threefive.list)
    .post(threefive.create);
  // Single threefive routes
  app.route('/api/threefive/:threefiveId').all(threefivePolicy.isAllowed)
    .get(threefive.read)
    .put(threefive.update)
    .delete(threefive.delete);

  // Finish by binding the threefive middleware
  app.param('threefiveId', threefive.threefiveByID);
};
