'use strict';

/**
 * Module dependencies
 */
var advicePolicy = require('../policies/advice.server.policy'),
  advice = require('../controllers/advice.server.controller');

module.exports = function (app) {
  // Advice collection routes
  app.route('/api/advice').all(advicePolicy.isAllowed)
    .get(advice.list)
    .post(advice.create);
  // Single advice routes
  app.route('/api/advice/:adviceId').all(advicePolicy.isAllowed)
    .get(advice.read)
    .put(advice.update)
    .delete(advice.delete);

  // Finish by binding the advice middleware
  app.param('adviceId', advice.adviceByID);
};
