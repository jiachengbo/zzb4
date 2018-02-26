'use strict';

/**
 * Module dependencies
 */
var orgsetPolicy = require('../policies/orgset.server.policy'),
  orgperson = require('../controllers/orgperson.server.controller');

module.exports = function (app) {
  // Orgset collection routes
  app.route('/api/orgperson').all(orgsetPolicy.isAllowed)
    .get(orgperson.list)
    .post(orgperson.create);
  // Single orgset routes
  app.route('/api/orgperson/:orgpersonId').all(orgsetPolicy.isAllowed)
    .get(orgperson.read)
    .post(orgperson.update)
    .delete(orgperson.delete);

  // Finish by binding the orgset middleware
  app.param('orgpersonId', orgperson.orgpersonByID);
};
