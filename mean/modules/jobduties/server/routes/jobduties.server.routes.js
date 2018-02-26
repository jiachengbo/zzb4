'use strict';

/**
 * Module dependencies
 */
var jobdutiesPolicy = require('../policies/jobduties.server.policy'),
  jobduties = require('../controllers/jobduties.server.controller');

module.exports = function (app) {
  // Jobduties collection routes
  app.route('/api/jobduties').all(jobdutiesPolicy.isAllowed)
    .get(jobduties.list)
    .post(jobduties.create);
  // Single jobduties routes
  app.route('/api/jobduties/:jobdutiesId').all(jobdutiesPolicy.isAllowed)
    .get(jobduties.read)
    .put(jobduties.update)
    .delete(jobduties.delete);

  // Finish by binding the jobduties middleware
  app.param('jobdutiesId', jobduties.jobdutiesByID);
};
