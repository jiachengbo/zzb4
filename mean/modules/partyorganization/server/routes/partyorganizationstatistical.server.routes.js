'use strict';

/**
 * Module dependencies
 */
var partymemberPolicy = require('../policies/partyorganization.server.policy'),
  partymember = require('../controllers/partyorganizationstatistical.server.controller');

module.exports = function (app) {
  // Partymember collection routes
  app.route('/api/partyorganizationstatistical').all(partymemberPolicy.isAllowed)
    .get(partymember.list);
};
