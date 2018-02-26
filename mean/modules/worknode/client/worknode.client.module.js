(function (app) {
  'use strict';

  app.registerModule('worknode', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('worknode.services');
  app.registerModule('worknode.routes', ['ui.router', 'core.routes', 'worknode.services']);
}(ApplicationConfiguration));
