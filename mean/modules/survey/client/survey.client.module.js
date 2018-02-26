(function (app) {
  'use strict';

  app.registerModule('survey', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('survey.services');
  app.registerModule('survey.routes', ['ui.router', 'core.routes', 'survey.services']);
}(ApplicationConfiguration));
