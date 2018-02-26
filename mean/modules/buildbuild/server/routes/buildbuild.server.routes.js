'use strict';

/**
 * Module dependencies
 */
var buildbuildPolicy = require('../policies/buildbuild.server.policy'),
  buildbuild = require('../controllers/buildbuild.server.controller');

module.exports = function (app) {
  // Buildbuild collection routes
  app.route('/api/buildbuild').all(buildbuildPolicy.isAllowed)
    .get(buildbuild.list)
    .post(buildbuild.create);
  // Single buildbuild routes
  app.route('/api/buildbuild/:buildbuildId').all(buildbuildPolicy.isAllowed)
    .get(buildbuild.read)
    .post(buildbuild.update)
    .delete(buildbuild.delete);

  // Finish by binding the buildbuild middleware
  app.param('buildbuildId', buildbuild.buildbuildByID);
};
