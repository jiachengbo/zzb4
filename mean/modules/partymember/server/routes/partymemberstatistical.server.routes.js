'use strict';

/**
 * Module dependencies
 */
var partymemberPolicy = require('../policies/partymember.server.policy'),
  partymember = require('../controllers/partymemberstatistical.server.controller');

module.exports = function (app) {
  // Partymember collection routes
  app.route('/api/partymemberstatistical').all(partymemberPolicy.isAllowed)
    .get(partymember.list);
};
