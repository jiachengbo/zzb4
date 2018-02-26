'use strict';

/**
 * Module dependencies
 */
var router = require('express').Router(),
  workpositionPolicy = require('../policies/workposition.server.policy'),
  workposition = require('../controllers/workposition.server.controller');

module.exports = function (app) {
  // Workposition collection routes
  router.route('/').all(workpositionPolicy.isAllowed)
    .get(workposition.list)
    .post(workposition.create);
  // Single workposition routes
  router.route('/:workpositionId').all(workpositionPolicy.isAllowed)
    .get(workposition.read)
    .put(workposition.update)
    .delete(workposition.delete);

  // Finish by binding the workposition middleware
  router.param('workpositionId', workposition.workpositionByID);

  app.use('/api/workposition', router);
};
