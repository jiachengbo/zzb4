'use strict';

/**
 * Module dependencies
 */
var projectAnalysisPolicy = require('../policies/projectAnalysis.server.policy'),
  projectAnalysis = require('../controllers/projectAnalysis.server.controller');

module.exports = function (app) {
  // ProjectAnalysis collection routes
  app.route('/api/projectAnalysis').all(projectAnalysisPolicy.isAllowed)
    .get(projectAnalysis.list)
    .post(projectAnalysis.create);
  // Single projectAnalysis routes
  app.route('/api/projectAnalysis/:projectManagerId').all(projectAnalysisPolicy.isAllowed)
    .get(projectAnalysis.read)
    .put(projectAnalysis.update)
    .delete(projectAnalysis.delete);

  // Finish by binding the projectAnalysis middleware
  app.param('projectManagerId', projectAnalysis.projectAnalysisByID);
};
