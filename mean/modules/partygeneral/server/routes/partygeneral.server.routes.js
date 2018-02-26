'use strict';

/**
 * Module dependencies
 */
var partygeneralPolicy = require('../policies/partygeneral.server.policy'),
  partygeneral = require('../controllers/partygeneral.server.controller');

module.exports = function (app) {
  // Partygeneral collection routes
  app.route('/api/partygeneral').all(partygeneralPolicy.isAllowed)
    .get(partygeneral.list)
    .post(partygeneral.create);
  // Single partygeneral routes
  app.route('/api/partygeneral/:branchID').all(partygeneralPolicy.isAllowed)
    .get(partygeneral.read)
    .put(partygeneral.update)
    .delete(partygeneral.delete);

  // Finish by binding the partygeneral middleware
  app.param('branchID', partygeneral.partygeneralByID);
};
