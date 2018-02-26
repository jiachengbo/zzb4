'use strict';

/**
 * Module dependencies
 */
var buildbuildPolicy = require('../policies/buildbuild.server.policy'),
  buildbuildperson = require('../controllers/buildbuildperson.server.controller');

module.exports = function (app) {
  // Buildbuild collection routes
  app.route('/api/buildbuildperson').all(buildbuildPolicy.isAllowed)
    .get(buildbuildperson.change);
  app.route('/api/buildperson')
    .get(buildbuildperson.create);
};
