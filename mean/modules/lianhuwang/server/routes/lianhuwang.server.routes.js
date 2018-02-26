'use strict';

/**
 * Module dependencies
 */
var lianhuwangPolicy = require('../policies/lianhuwang.server.policy'),
  lianhuwang = require('../controllers/lianhuwang.server.controller');

module.exports = function (app) {
  // Lianhuwang collection routes
  app.route('/api/lianhuwang').all(lianhuwangPolicy.isAllowed)
    .get(lianhuwang.list)
    .post(lianhuwang.create);
  // Single lianhuwang routes
  app.route('/api/lianhuwang/:lianhuwangId').all(lianhuwangPolicy.isAllowed)
    .get(lianhuwang.read)
    .put(lianhuwang.update)
    .delete(lianhuwang.delete);

  // Finish by binding the lianhuwang middleware
  app.param('lianhuwangId', lianhuwang.lianhuwangByID);
};
