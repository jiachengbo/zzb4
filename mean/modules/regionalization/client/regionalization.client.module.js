(function (app) {
  'use strict';

  app.registerModule('regionalization', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('regionalization.services');
  app.registerModule('regionalization.routes', ['ui.router', 'core.routes', 'regionalization.services']);
}(ApplicationConfiguration));
