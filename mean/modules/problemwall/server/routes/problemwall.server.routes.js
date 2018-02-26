'use strict';

/**
 * Module dependencies
 */
var problemWallPolicy = require('../policies/problemwall.server.policy'),
  problemWall = require('../controllers/problemwall.server.controller');

module.exports = function (app) {
  // ProblemWall collection routes
  app.route('/api/problemWall').all(problemWallPolicy.isAllowed)
    .get(problemWall.list)
    .post(problemWall.create);
  // Single problemWall routes
  app.route('/api/problemWall/:problemWallId').all(problemWallPolicy.isAllowed)
    .get(problemWall.read)
    .post(problemWall.update)
    .delete(problemWall.delete);

  // Finish by binding the problemWall middleware
  app.param('problemWallId', problemWall.problemWallByID);
};
