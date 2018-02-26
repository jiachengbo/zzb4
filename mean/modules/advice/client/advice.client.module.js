(function (app) {
  'use strict';

  app.registerModule('advice', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('advice.services');
  app.registerModule('advice.routes', ['ui.router', 'core.routes', 'advice.services']);
}(ApplicationConfiguration));
