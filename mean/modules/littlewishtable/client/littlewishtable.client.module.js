(function (app) {
  'use strict';

  app.registerModule('littleWishTable', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('littleWishTable.services');
  app.registerModule('littleWishTable.routes', ['ui.router', 'core.routes', 'littleWishTable.services']);
}(ApplicationConfiguration));
