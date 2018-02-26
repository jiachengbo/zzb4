'use strict';

/**
 * Module dependencies
 */
var orgsetPolicy = require('../policies/orgset.server.policy'),
  orgset = require('../controllers/orgset.server.controller');

module.exports = function (app) {
  // Orgset collection routes
  app.route('/api/orgtable')
    .get(orgset.worklists)
    .post(orgset.worklist);
  app.route('/api/orgtable/:orgId')
    .get(orgset.workllllist)
    .post(orgset.updates);
  app.route('/api/orgset').all(orgsetPolicy.isAllowed)
    .get(orgset.list)
    .post(orgset.create);
  // Single orgset routes
  app.route('/api/orgset/:orgsetId').all(orgsetPolicy.isAllowed)
    .get(orgset.read)
    .post(orgset.update)
    .delete(orgset.delete);
  // Finish by binding the orgset middleware
  app.param('orgId', orgset.orgtableByID);
  app.param('orgsetId', orgset.orgsetByID);
};
