(function () {
  'use strict';

  angular
    .module('regionalization.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('regionalization', {
        abstract: true,
        url: '/regionalization',
        template: '<ui-view/>'
      })
      .state('regionalization.project', {
        url: '/project',
        templateUrl: '/modules/regionalization/client/views/regionalization-projecttable.client.view.html',
        controller: 'projectProjectController',
        controllerAs: 'vm',
        data: {
          pageTitle: '项目管理'
        }
      });
  }
}());
