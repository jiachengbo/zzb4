(function () {
  'use strict';

  angular
    .module('partymap.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('partymap', {
        url: '/partymap',
        templateUrl: '/modules/partymap/client/views/partymap-curdtable.client.view.html',
        controller: 'PartymapCURDTableController',
        controllerAs: 'vm',
        data: {
          pageTitle: '党建地图'
        }
      })
   /*   .state('partymap', {
        abstract: true,
        url: '/partymap',
        template: '<ui-view/>'
      })
      .state('partymap.curd', {
        url: '/curd',
        templateUrl: '/modules/partymap/client/views/partymap-curdtable.client.view.html',
        controller: 'PartymapCURDTableController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Partymap CURD Table'
        }
      })*/
    ;
  }
}());
