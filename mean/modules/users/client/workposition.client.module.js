(function (app) {
  'use strict';

  app.registerModule('workposition', ['users.admin']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('workposition.services');
  app.registerModule('workposition.routes', ['users.admin.routes', 'workposition.services']);
}(ApplicationConfiguration));
