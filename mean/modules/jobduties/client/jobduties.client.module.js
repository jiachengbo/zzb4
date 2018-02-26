(function (app) {
  'use strict';

  app.registerModule('jobduties', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('jobduties.services');
  app.registerModule('jobduties.routes', ['ui.router', 'core.routes', 'jobduties.services']);
}(ApplicationConfiguration));
