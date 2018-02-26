(function (app) {
  'use strict';

  app.registerModule('partymoney', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('partymoney.services');
  app.registerModule('partymoney.routes', ['ui.router', 'core.routes', 'partymoney.services']);
}(ApplicationConfiguration));
