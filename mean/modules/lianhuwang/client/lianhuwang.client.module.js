(function (app) {
  'use strict';

  app.registerModule('lianhuwang', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('lianhuwang.services');
  app.registerModule('lianhuwang.routes', ['ui.router', 'core.routes', 'lianhuwang.services']);
}(ApplicationConfiguration));
