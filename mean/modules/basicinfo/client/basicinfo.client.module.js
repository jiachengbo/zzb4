(function (app) {
  'use strict';

  app.registerModule('basicinfo', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('basicinfo.services');
  app.registerModule('basicinfo.routes', ['ui.router', 'core.routes', 'basicinfo.services']);
}(ApplicationConfiguration));
