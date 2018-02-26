(function (app) {
  'use strict';

  app.registerModule('buildbuild', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('buildbuild.services');
  app.registerModule('buildbuild.routes', ['ui.router', 'core.routes', 'buildbuild.services']);
}(ApplicationConfiguration));
