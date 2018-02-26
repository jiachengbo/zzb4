(function () {
  'use strict';

  angular
    .module('lianhuwang.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('lianhuwang', {
        abstract: true,
        url: '/lianhuwang',
        template: '<ui-view/>'
      })
      .state('lianhuwang.curd', {
        url: '/curd',
        templateUrl: '/modules/lianhuwang/client/views/lianhuwang-curdtable.client.view.html',
        controller: 'LianhuwangCURDTableController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Lianhuwang CURD Table'
        }
      });
  }
}());
