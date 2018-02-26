(function (app) {
  'use strict';

  app.registerModule('threefive', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('threefive.services');
  app.registerModule('threefive.routes', ['ui.router', 'core.routes', 'threefive.services']);
}(ApplicationConfiguration));
