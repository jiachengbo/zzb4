'use strict';

/**
 * Module dependencies
 */
var problemPolicy = require('../policies/problem.server.policy'),
  problem = require('../controllers/problem.server.controller');

module.exports = function (app) {
  // Problem collection routes
  app.route('/api/problem').all(problemPolicy.isAllowed)
    .get(problem.list)
    .post(problem.create);
  // Single problem routes
  app.route('/api/problem/:problemId').all(problemPolicy.isAllowed)
    .get(problem.read)
    .put(problem.update)
    .delete(problem.delete);

  // Finish by binding the problem middleware
  app.param('problemId', problem.problemByID);
};
