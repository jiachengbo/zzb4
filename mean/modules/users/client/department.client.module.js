(function (app) {
  'use strict';

  app.registerModule('department', ['users.admin']);
  app.registerModule('department.services');
  app.registerModule('department.routes', ['users.admin.routes', 'department.services']);
}(ApplicationConfiguration));
