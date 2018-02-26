'use strict';

/**
 * Module dependencies
 */
var worknodePolicy = require('../policies/worknode.server.policy'),
  worknode = require('../controllers/worknode.server.controller');

module.exports = function (app) {
  // Worknode collection routes
  app.route('/api/worknode').all(worknodePolicy.isAllowed)
    .get(worknode.list)
    .post(worknode.update);
  // Single worknode routes
  app.route('/api/worknode/:worknodeId').all(worknodePolicy.isAllowed)
    .get(worknode.read)
    .post(worknode.update)
    .delete(worknode.delete);

  // Finish by binding the worknode middleware
  app.param('worknodeId', worknode.worknodeByID);
};
