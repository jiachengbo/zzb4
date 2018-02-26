'use strict';

/**
 * Module dependencies
 */
var threelessonsPolicy = require('../policies/threelessons.server.policy'),
  threelessons = require('../controllers/threelessons.server.controller');

module.exports = function (app) {
  // Threelessons collection routes
  app.route('/api/threelessons').all(threelessonsPolicy.isAllowed)
    .get(threelessons.list)
    .post(threelessons.update);
  // Single threelessons routes
  app.route('/api/threelessons/:threelessonsId').all(threelessonsPolicy.isAllowed)
    .get(threelessons.read)
    .post(threelessons.update)
    .delete(threelessons.delete);

  // Finish by binding the threelessons middleware
  app.param('threelessonsId', threelessons.threelessonsByID);
};
