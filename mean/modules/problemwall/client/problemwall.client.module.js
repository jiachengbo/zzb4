(function (app) {
  'use strict';

  app.registerModule('problemWall', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('problemWall.services');
  app.registerModule('problemWall.routes', ['ui.router', 'core.routes', 'problemWall.services']);
}(ApplicationConfiguration));
