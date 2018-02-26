'use strict';

/**
 * Module dependencies
 */
var partymoneyPolicy = require('../policies/partymoney.server.policy'),
  partymoney = require('../controllers/partymoney.server.controller');

module.exports = function (app) {
  // Partymoney collection routes
  app.route('/api/partymoney').all(partymoneyPolicy.isAllowed)
    .get(partymoney.list)
    .post(partymoney.create);
  // Single partymoney routes
  app.route('/api/partymoney/:partymoneyId').all(partymoneyPolicy.isAllowed)
    .get(partymoney.read)
    .put(partymoney.update)
    .delete(partymoney.delete);

  // Finish by binding the partymoney middleware
  app.param('partymoneyId', partymoney.partymoneyByID);
};
