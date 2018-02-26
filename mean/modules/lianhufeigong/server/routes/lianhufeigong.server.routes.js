'use strict';

/**
 * Module dependencies
 */
var lianhufeigongPolicy = require('../policies/lianhufeigong.server.policy'),
  lianhufeigong = require('../controllers/lianhufeigong.server.controller');

module.exports = function (app) {
  // Lianhufeigong collection routes
  app.route('/api/lianhufeigong').all(lianhufeigongPolicy.isAllowed)
    .get(lianhufeigong.list)
    .post(lianhufeigong.create);
  // Single lianhufeigong routes
  app.route('/api/lianhufeigong/:lianhufeigongId').all(lianhufeigongPolicy.isAllowed)
    .get(lianhufeigong.read)
    .put(lianhufeigong.update)
    .delete(lianhufeigong.delete);

  // Finish by binding the lianhufeigong middleware
  app.param('lianhufeigongId', lianhufeigong.lianhufeigongByID);
};
