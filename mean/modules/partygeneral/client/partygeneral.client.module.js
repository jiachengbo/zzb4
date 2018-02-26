(function (app) {
  'use strict';

  app.registerModule('partygeneral', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('partygeneral.services');
  app.registerModule('partygeneral.routes', ['ui.router', 'core.routes', 'partygeneral.services']);
}(ApplicationConfiguration));
