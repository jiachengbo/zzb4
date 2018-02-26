(function (app) {
  'use strict';

  app.registerModule('page', ['core', 'task', 'page']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('page.services');
  app.registerModule('page.routes', ['ui.router', 'core.routes', 'page.services']);
}(ApplicationConfiguration));
