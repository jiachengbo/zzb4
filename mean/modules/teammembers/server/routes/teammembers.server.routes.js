'use strict';

/**
 * Module dependencies
 */
var teammembersPolicy = require('../policies/teammembers.server.policy'),
  teammembers = require('../controllers/teammembers.server.controller');

module.exports = function (app) {
  // Teammembers collection routes
  app.route('/api/teammembers').all(teammembersPolicy.isAllowed)
    .get(teammembers.list)
    .post(teammembers.create);
  // Single teammembers routes
  app.route('/api/teammembers/:teammembersId').all(teammembersPolicy.isAllowed)
    .get(teammembers.read)
    .post(teammembers.update)
    .delete(teammembers.delete);

  // Finish by binding the teammembers middleware
  app.param('teammembersId', teammembers.teammembersByID);
};
