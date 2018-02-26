(function (app) {
  'use strict';

  //首先加载core，可覆盖core controllers
  app.registerModule('global', ['core', 'core.services', 'page']);
  app.registerModule('global.routes');
  app.registerModule('global.services');
}(ApplicationConfiguration));
