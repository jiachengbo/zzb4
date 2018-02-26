(function (app) {
  'use strict';

  app.registerModule('problem', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('problem.services');
  app.registerModule('problem.routes', ['ui.router', 'core.routes', 'problem.services']);
}(ApplicationConfiguration));
