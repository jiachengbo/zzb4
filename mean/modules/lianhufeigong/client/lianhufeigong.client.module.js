(function (app) {
  'use strict';

  app.registerModule('lianhufeigong', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('lianhufeigong.services');
  app.registerModule('lianhufeigong.routes', ['ui.router', 'core.routes', 'lianhufeigong.services']);
}(ApplicationConfiguration));
