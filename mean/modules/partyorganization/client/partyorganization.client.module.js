(function (app) {
  'use strict';

  app.registerModule('partyorganization', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('partyorganization.services');
  app.registerModule('partyorganization.routes', ['ui.router', 'core.routes', 'partyorganization.services']);
}(ApplicationConfiguration));
