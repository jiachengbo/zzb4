'use strict';

/**
 * Module dependencies
 */
var appealPolicy = require('../policies/appeal.server.policy'),
  appealsb = require('../controllers/appealsb.server.controller');

module.exports = function (app) {
  // Appeal collection routes
  app.route('/api/appealsb').all(appealPolicy.isAllowed)
    .get(appealsb.create);
    // .get(appealsb.list)
    // .post(appealsb.create);
  // Single appeal routes
  app.route('/api/appealsb/:id').all(appealPolicy.isAllowed)
    .get(appealsb.delete);
    // .get(appealsb.read)
    // .put(appealsb.update)
    // .delete(appealsb.delete);
  app.route('/api/appealzq')
    .get(appealsb.createzq);
  // Finish by binding the appeal middleware
  app.param('id', appealsb.appealsbByID);
};
