(function (app) {
  'use strict';

  app.registerModule('projectAnalysis', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('projectAnalysis.services');
  app.registerModule('projectAnalysis.routes', ['ui.router', 'core.routes', 'projectAnalysis.services']);
}(ApplicationConfiguration));
