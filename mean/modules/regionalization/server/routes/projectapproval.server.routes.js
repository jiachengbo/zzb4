'use strict';

/**
 * Module dependencies
 */
var regionalizationPolicy = require('../policies/regionalization.server.policy'),
  project = require('../controllers/projectapproval.server.controller');

module.exports = function (app) {
  // Single regionalization routes
  app.route('/api/regionalization/projectapproval/:approvalId').all(regionalizationPolicy.isAllowed)
    .get(project.read)
    .put(project.update);

  // Finish by binding the regionalization middleware
  app.param('approvalId', project.approvalByID);
};
