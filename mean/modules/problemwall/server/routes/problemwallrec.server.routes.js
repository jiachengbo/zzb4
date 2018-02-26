'use strict';

/**
 * Module dependencies
 */
var problemWallPolicy = require('../policies/problemwall.server.policy'),
  problemWallRec = require('../controllers/problemWallRec.server.controller');

module.exports = function (app) {
  // ProblemWall collection routes
  app.route('/api/problemWallRec').all(problemWallPolicy.isAllowed)
    .get(problemWallRec.create);
  // Single problemWall routes
  app.route('/api/problemWallRec/:problemWallRecId').all(problemWallPolicy.isAllowed)
    .get(problemWallRec.read)
    .put(problemWallRec.update)
    .delete(problemWallRec.delete);

  // Finish by binding the problemWall middleware
  app.param('problemWallRecId', problemWallRec.problemWallRecByID);
};
