(function () {
  'use strict';

  angular
    .module('advice.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('advice', {
        abstract: true,
        url: '/advice',
        template: '<ui-view/>'
      })
      .state('advice.curd', {
        url: '/curd',
        templateUrl: '/modules/advice/client/views/advice-curdtable.client.view.html',
        controller: 'AdviceCURDTableController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Advice CURD Table'
        }
      });
  }
}());
