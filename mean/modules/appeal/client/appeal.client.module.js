(function (app) {
  'use strict';

  app.registerModule('appeal', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('appeal.services');
  app.registerModule('appeal.routes', ['ui.router', 'core.routes', 'appeal.services']);
}(ApplicationConfiguration));
