'use strict';

/**
 * Module dependencies
 */
var partymapPolicy = require('../policies/partymap.server.policy'),
  partymap = require('../controllers/partymap.server.controller');

module.exports = function (app) {
  // Partymap collection routes
  app.route('/api/partymap').all(partymapPolicy.isAllowed)
    .get(partymap.list)
    .post(partymap.create);
  // Single partymap routes
  app.route('/api/partymap/:partymapId').all(partymapPolicy.isAllowed)
    .get(partymap.read)
    .put(partymap.update)
    .delete(partymap.delete);

  // Finish by binding the partymap middleware
  app.param('partymapId', partymap.partymapByID);
};
