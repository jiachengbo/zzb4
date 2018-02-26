(function (app) {
  'use strict';

  app.registerModule('users');
  app.registerModule('users.admin', ['core.admin']);
  app.registerModule('users.admin.services');
  app.registerModule('users.admin.routes', ['core.admin.routes']);
  app.registerModule('users.routes', ['core.routes', 'users.services']);
  app.registerModule('users.services');
}(ApplicationConfiguration));
