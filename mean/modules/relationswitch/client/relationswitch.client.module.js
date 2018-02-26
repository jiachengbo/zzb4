(function (app) {
  'use strict';

  app.registerModule('relationswitch', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('relationswitch.services');
  app.registerModule('relationswitch.routes', ['ui.router', 'core.routes', 'relationswitch.services']);
}(ApplicationConfiguration));
