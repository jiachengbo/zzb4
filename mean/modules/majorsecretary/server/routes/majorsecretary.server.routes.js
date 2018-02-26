'use strict';

/**
 * Module dependencies
 */
var majorsecretaryPolicy = require('../policies/majorsecretary.server.policy'),
  majorsecretary = require('../controllers/majorsecretary.server.controller');

module.exports = function (app) {
  // Majorsecretary collection routes
  app.route('/api/majorsecretary').all(majorsecretaryPolicy.isAllowed)
    .get(majorsecretary.list)
    .post(majorsecretary.create);
  // Single majorsecretary routes
  app.route('/api/majorsecretary/:majorsecretaryId').all(majorsecretaryPolicy.isAllowed)
    .get(majorsecretary.read)
    .post(majorsecretary.update)
    .delete(majorsecretary.delete);

  // Finish by binding the majorsecretary middleware
  app.param('majorsecretaryId', majorsecretary.majorsecretaryByID);
};
