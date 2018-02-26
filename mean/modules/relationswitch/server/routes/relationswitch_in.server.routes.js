'use strict';

/**
 * Module dependencies
 */
var relationswitchPolicy = require('../policies/relationswitch.server.policy'),
  relationswitch = require('../controllers/relationswitch_in.server.controller');

module.exports = function (app) {
  // Relationswitch collection routes
  app.route('/api/relationswitchin').all(relationswitchPolicy.isAllowed)
    .get(relationswitch.list)
    .post(relationswitch.update);
  // Single relationswitch routes
  app.route('/api/relationswitchin/:relationswitchinId').all(relationswitchPolicy.isAllowed)
    .get(relationswitch.read)
    .post(relationswitch.update)
    .delete(relationswitch.delete);

  // Finish by binding the relationswitch middleware
  app.param('relationswitchinId', relationswitch.dj_MemberRelationInByID);
};
