'use strict';

/**
 * Module dependencies
 */
var committeeTablePolicy = require('../policies/committeeTable.server.policy'),
  committeeTable = require('../controllers/committeeTable.server.controller');

module.exports = function (app) {
  // CommitteeTable collection routes
  app.route('/api/committeeTable').all(committeeTablePolicy.isAllowed)
    .get(committeeTable.list)
    .post(committeeTable.create);
  // Single committeeTable routes
  app.route('/api/committeeTable/:committeeTableId')//.all(committeeTablePolicy.isAllowed)
    .get(committeeTable.read)
    .post(committeeTable.update)
    .delete(committeeTable.delete);

  // Finish by binding the committeeTable middleware
  app.param('committeeTableId', committeeTable.committeeTableByID);
};
