(function (app) {
  'use strict';

  app.registerModule('partymember', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('partymember.services');
  app.registerModule('partymember.routes', ['ui.router', 'core.routes', 'partymember.services']);
}(ApplicationConfiguration));
