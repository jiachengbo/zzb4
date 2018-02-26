'use strict';

/**
 * Module dependencies
 */
var regionalizationPolicy = require('../policies/regionalization.server.policy'),
  project = require('../controllers/project.server.controller');

module.exports = function (app) {
  // Regionalization collection routes
  app.route('/api/regionalization/project').all(regionalizationPolicy.isAllowed)
    .get(project.list)
    .post(project.create);
  // Single regionalization routes
  app.route('/api/regionalization/project/:ProjectId').all(regionalizationPolicy.isAllowed)
    .get(project.read)
    .post(project.update)
    .delete(project.delete);

  // Finish by binding the regionalization middleware
  app.param('ProjectId', project.projectByID);
};
