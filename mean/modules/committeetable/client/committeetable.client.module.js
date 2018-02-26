(function (app) {
  'use strict';

  app.registerModule('committeeTable', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('committeeTable.services');
  app.registerModule('committeeTable.routes', ['ui.router', 'core.routes', 'committeeTable.services']);
}(ApplicationConfiguration));
