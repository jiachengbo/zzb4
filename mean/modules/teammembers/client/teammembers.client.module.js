(function (app) {
  'use strict';

  app.registerModule('teammembers', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('teammembers.services');
  app.registerModule('teammembers.routes', ['ui.router', 'core.routes', 'teammembers.services']);
}(ApplicationConfiguration));
