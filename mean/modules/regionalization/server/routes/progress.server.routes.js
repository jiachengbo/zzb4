'use strict';

/**
 * Module dependencies
 */
var regionalizationPolicy = require('../policies/regionalization.server.policy'),
  progress = require('../controllers/progress.server.controller');

module.exports = function (app) {
  // Regionalization collection routes
  app.route('/api/regionalization/progress').all(regionalizationPolicy.isAllowed)
    .get(progress.list)
    .post(progress.create);
  // Single regionalization routes
  app.route('/api/regionalization/progress/:ProgressId').all(regionalizationPolicy.isAllowed)
    .get(progress.read)
    .post(progress.update)
    .delete(progress.delete);

  // Finish by binding the regionalization middleware
  app.param('ProgressId', progress.progressByID);
};
