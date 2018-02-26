'use strict';

/**
 * Module dependencies
 */
var littleWishTablePolicy = require('../policies/littlewishtable.server.policy'),
  littleWishTable = require('../controllers/littleWishTable.server.controller');

module.exports = function (app) {
  // LittleWishTable collection routes
  app.route('/api/littleWishTable').all(littleWishTablePolicy.isAllowed)
    .get(littleWishTable.list)
    .post(littleWishTable.update);
  // Single littleWishTable routes
  app.route('/api/littleWishTable/:littleId').all(littleWishTablePolicy.isAllowed)
    .get(littleWishTable.read)
    .post(littleWishTable.update)
    .delete(littleWishTable.delete);

  // Finish by binding the littleWishTable middleware
  app.param('littleId', littleWishTable.littleWishTableByID);
};
