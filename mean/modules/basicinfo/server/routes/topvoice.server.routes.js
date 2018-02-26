'use strict';

/**
 * Module dependencies
 */
var basicinfoPolicy = require('../policies/basicinfo.server.policy'),
  basicinfo = require('../controllers/topvoice.server.controller');

module.exports = function (app) {
  // Basicinfo collection routes
  app.route('/api/basic/topvoiceinfo').all(basicinfoPolicy.isAllowed)
    .get(basicinfo.list)
    .post(basicinfo.update);
  // Single basicinfo routes
  app.route('/api/basic/topvoiceinfo/:topvoiceinfoId').all(basicinfoPolicy.isAllowed)
    .get(basicinfo.read)
    .post(basicinfo.update)
    .delete(basicinfo.delete);

  // Finish by binding the basicinfo middleware
  app.param('topvoiceinfoId', basicinfo.topvoiceinfoByID);
};
