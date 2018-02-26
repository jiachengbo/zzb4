(function () {
  'use strict';

  angular
    .module('core.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        data: {
          // roles: ['xtsz'],
          childSystem: ['admin.**'],
          pageTitle: '系统管理'
        }
      });
  }
}());
