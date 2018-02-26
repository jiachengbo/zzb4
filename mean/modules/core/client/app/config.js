(function (window) {
  'use strict';

  var applicationModuleName = 'mean';

  var service = {
    applicationEnvironment: window.env,
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: ['ngResource', 'ngAnimate', 'ngMessages',
      'ui.router', 'ui.router.state.events', 'ui.bootstrap', 'ngFileUpload', 'ui-notification',
      'ui.grid', 'ui.grid.selection', 'ui.grid.edit', 'ui.grid.rowEdit', 'ui.grid.cellNav',
      'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.autoResize', 'ui.grid.exporter',
      'treeControl', 'nvd3', 'ngDraggable', 'ngStorage', 'ngSanitize', 'openlayers-directive'],
    registerModule: registerModule
  };

  window.ApplicationConfiguration = service;

  // Add a new vertical module
  function registerModule(moduleName, dependencies) {
/*
    var extentCoreRoutes = window.sharedConfig.extentCoreRoutes;
    if (extentCoreRoutes) {
      if (moduleName === 'core.routes') {
        if (!dependencies) {
          dependencies = [extentCoreRoutes];
        } else if (Array.isArray(dependencies)) {
          dependencies.push(extentCoreRoutes);
        } else {
          dependencies = [dependencies, extentCoreRoutes];
        }
      }
    }
*/
    // Create angular module
    angular.module(moduleName, dependencies || []);
    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  }

  // Angular-ui-notification configuration
  angular.module('ui-notification').config(function(NotificationProvider) {
    NotificationProvider.setOptions({
      delay: 3000,
      startTop: 20,
      startRight: 10,
      verticalSpacing: 20,
      horizontalSpacing: 20,
      positionX: 'right',
      positionY: 'bottom'
    });
  });
}(window));
