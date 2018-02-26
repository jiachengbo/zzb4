(function () {
  'use strict';

  angular
    .module('threelessons.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('threelessons', {
        abstract: true,
        url: '/threelessons',
        template: '<ui-view/>'
      })
      .state('threelessons.curd', {
        url: '/curd',
        templateUrl: '/modules/threelessons/client/views/threelessons-curdtable.client.view.html',
        controller: 'ThreelessonsCURDTableController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Threelessons CURD Table'
        }
      });
  }
}());
