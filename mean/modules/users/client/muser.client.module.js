(function (app) {
  'use strict';

  app.registerModule('muser', ['users.admin']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('muser.services');
  app.registerModule('muser.routes', ['users.admin.routes', 'muser.services']);
}(ApplicationConfiguration));
