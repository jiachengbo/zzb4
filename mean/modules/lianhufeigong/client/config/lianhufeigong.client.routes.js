(function () {
  'use strict';

  angular
    .module('lianhufeigong.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('lianhufeigong', {
        abstract: true,
        url: '/lianhufeigong',
        template: '<ui-view/>'
      })
      .state('lianhufeigong.curd', {
        url: '/curd',
        templateUrl: '/modules/lianhufeigong/client/views/lianhufeigong-curdtable.client.view.html',
        controller: 'LianhufeigongCURDTableController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Lianhufeigong CURD Table'
        }
      });
  }
}());
