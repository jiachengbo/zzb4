(function () {
  'use strict';

  angular
    .module('partymoney.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('partymoney', {
        abstract: true,
        url: '/partymoney',
        template: '<ui-view/>'
      })
      .state('partymoney.curd', {
        url: '/curd',
        templateUrl: '/modules/partymoney/client/views/partymoney-curdtable.client.view.html',
        controller: 'PartymoneyCURDTableController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Partymoney CURD Table'
        }
      })
      .state('partymoney.curd1', {
        url: '/curd1',
        templateUrl: '/modules/partymoney/client/views/partymoney-dgwtable.client.view.html',
        controller: 'Partymoney1CURDTableController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Partymoney CURD Table'
        }
      });
  }
}());
