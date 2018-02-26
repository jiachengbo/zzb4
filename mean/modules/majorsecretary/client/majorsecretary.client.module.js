(function (app) {
  'use strict';

  app.registerModule('majorsecretary', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('majorsecretary.services');
  app.registerModule('majorsecretary.routes', ['ui.router', 'core.routes', 'majorsecretary.services']);
}(ApplicationConfiguration));
