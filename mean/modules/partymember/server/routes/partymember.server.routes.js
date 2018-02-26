'use strict';

/**
 * Module dependencies
 */
var partymemberPolicy = require('../policies/partymember.server.policy'),
  partymember = require('../controllers/partymember.server.controller');

module.exports = function (app) {
  // Partymember collection routes
  app.route('/api/partymember').all(partymemberPolicy.isAllowed)
    .get(partymember.list)
    .post(partymember.create);
  // Single partymember routes
  app.route('/api/partymember/:partymemberId').all(partymemberPolicy.isAllowed)
    .get(partymember.read)
    .put(partymember.update)
    .delete(partymember.delete);

  // Finish by binding the partymember middleware
  app.param('partymemberId', partymember.dj_PartyMemberByID);
};
