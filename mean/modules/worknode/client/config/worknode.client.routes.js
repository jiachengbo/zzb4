(function () {
  'use strict';

  angular
    .module('worknode.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('worknode', {
        abstract: true,
        url: '/worknode',
        template: '<ui-view/>'
      })
      .state('worknode.curd', {
        url: '/curd',
        templateUrl: '/modules/worknode/client/views/worknode-curdtable.client.view.html',
        controller: 'WorknodeCURDTableController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Worknode CURD Table'
        }
      });
  }
}());
