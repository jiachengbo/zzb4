(function (app) {
  'use strict';

  app.registerModule('threelessons', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('threelessons.services');
  app.registerModule('threelessons.routes', ['ui.router', 'core.routes', 'threelessons.services']);
}(ApplicationConfiguration));
