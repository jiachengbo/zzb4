(function (app) {
  'use strict';

  app.registerModule('role', ['users.admin']);
  app.registerModule('role.services');
  app.registerModule('role.routes', ['users.admin.routes']);
}(ApplicationConfiguration));
