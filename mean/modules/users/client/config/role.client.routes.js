(function () {
  'use strict';

  angular
    .module('role.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.role', {
        url: '/role',
        templateUrl: '/modules/users/client/views/admin/role.client.view.html',
        controller: 'RoleController',
        controllerAs: 'vm',
        data: {
          pageTitle: '权限管理'
        }
      });
  }
}());
