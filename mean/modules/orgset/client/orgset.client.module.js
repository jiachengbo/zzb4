(function (app) {
  'use strict';

  app.registerModule('orgset', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('orgset.services');
  app.registerModule('orgset.routes', ['ui.router', 'core.routes', 'orgset.services']);
}(ApplicationConfiguration));
