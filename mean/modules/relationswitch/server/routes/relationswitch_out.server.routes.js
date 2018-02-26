'use strict';

/**
 * Module dependencies
 */
var relationswitchPolicy = require('../policies/relationswitch.server.policy'),
  relationswitch = require('../controllers/relationswitch_out.server.controller');

module.exports = function (app) {
  // Relationswitch collection routes
  app.route('/api/relationswitchout').all(relationswitchPolicy.isAllowed)
    .get(relationswitch.list)
    .post(relationswitch.update);
  // Single relationswitch routes
  app.route('/api/relationswitchout/:relationswitchoutId').all(relationswitchPolicy.isAllowed)
    .get(relationswitch.read)
    .post(relationswitch.update)
    .delete(relationswitch.delete);

  // Finish by binding the relationswitch middleware
  app.param('relationswitchoutId', relationswitch.dj_MemberRelationOutByID);
};
