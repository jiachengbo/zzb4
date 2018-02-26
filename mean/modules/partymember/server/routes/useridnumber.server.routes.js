'use strict';

/**
 * Module dependencies
 */
var partymemberPolicy = require('../policies/partymember.server.policy'),
  useridnumber = require('../controllers/useridnumber.server.controller');

module.exports = function (app) {
  // Partymember collection routes
  app.route('/api/useridnumber').all(partymemberPolicy.isAllowed)
    .get(useridnumber.list);
};
