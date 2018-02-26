'use strict';

/**
 * Module dependencies
 */
var partyorganizationPolicy = require('../policies/partyorganization.server.policy'),
  partyorganization = require('../controllers/partyorganization.server.controller');

module.exports = function (app) {
  // Partyorganization collection routes
  app.route('/api/partyorganization').all(partyorganizationPolicy.isAllowed)
    .get(partyorganization.list)
    .post(partyorganization.create);
  // Single partyorganization routes
  app.route('/api/partyorganization/:partyorganizationId').all(partyorganizationPolicy.isAllowed)
    .get(partyorganization.read)
    .put(partyorganization.update)
    .delete(partyorganization.delete);

  // Finish by binding the partyorganization middleware
  app.param('partyorganizationId', partyorganization.dj_PartyBranchByID);
};
