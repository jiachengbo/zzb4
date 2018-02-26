'use strict';

/**
 * Module dependencies
 */
var surveyPolicy = require('../policies/survey.server.policy'),
  survey = require('../controllers/survey.server.controller');

module.exports = function (app) {
  // Survey collection routes
  app.route('/api/survey').all(surveyPolicy.isAllowed)
    .get(survey.list)
    .post(survey.update);
  // Single survey routes
  app.route('/api/survey/:surveyId').all(surveyPolicy.isAllowed)
    .get(survey.read)
    .post(survey.update)
    .delete(survey.delete);

  // Finish by binding the survey middleware
  app.param('surveyId', survey.surveyByID);
};
