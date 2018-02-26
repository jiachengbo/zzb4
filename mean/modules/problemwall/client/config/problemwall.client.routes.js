(function () {
  'use strict';

  angular
    .module('problemWall.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('problemWall', {
        abstract: true,
        url: '/problemWall',
        template: '<ui-view/>'
      })
      .state('problemWall.curd', {
        url: '/curd',
        templateUrl: '/modules/problemwall/client/views/problemwall-curdtable.client.view.html',
        controller: 'ProblemWallCURDTableController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'ProblemWall CURD Table'
        }
      });
  }
}());
