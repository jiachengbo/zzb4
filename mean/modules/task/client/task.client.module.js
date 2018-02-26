(function (app) {
  'use strict';

  app.registerModule('task', ['core', 'task']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('task.services');
  app.registerModule('task.routes', ['ui.router', 'core.routes', 'task.services']);
}(ApplicationConfiguration));
