(function (app) {
  'use strict';

  app.registerModule('partymap', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('partymap.services');
  app.registerModule('partymap.routes', ['ui.router', 'core.routes', 'partymap.services']);
}(ApplicationConfiguration));
