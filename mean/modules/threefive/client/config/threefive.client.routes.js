(function () {
  'use strict';

  angular
    .module('threefive.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('threefive', {
        abstract: true,
        url: '/threefive',
        template: '<ui-view/>'
      })
      .state('threefive.curd', {
        url: '/curd',
        templateUrl: '/modules/threefive/client/views/threefive-curdtable.client.view.html',
        controller: 'ThreefiveCURDTableController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Threefive CURD Table'
        }
      });
  }
}());
