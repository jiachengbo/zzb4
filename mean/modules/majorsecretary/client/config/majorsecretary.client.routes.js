(function () {
  'use strict';

  angular
    .module('majorsecretary.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('majorsecretary', {
        abstract: true,
        url: '/majorsecretary',
        template: '<ui-view/>'
      })
      .state('majorsecretary.curd', {
        url: '/curd',
        templateUrl: '/modules/majorsecretary/client/views/majorsecretary-curdtable.client.view.html',
        controller: 'MajorsecretaryCURDTableController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Majorsecretary CURD Table'
        }
      });
  }
}());
