(function () {
  'use strict';

  angular
    .module('department.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.department', {
        url: '/department',
        templateUrl: '/modules/users/client/views/admin/department.client.view.html',
        controller: 'DepartmentController',
        controllerAs: 'vm',
        data: {
          pageTitle: '部门管理'
        }
      });
  }
}());
