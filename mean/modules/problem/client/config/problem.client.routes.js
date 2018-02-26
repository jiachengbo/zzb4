(function () {
  'use strict';

  angular
    .module('problem.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('problem', {
        abstract: true,
        url: '/problem',
        template: '<ui-view/>'
      })
      .state('problem.curd', {
        url: '/curd',
        templateUrl: '/modules/problem/client/views/problem-curdtable.client.view.html',
        controller: 'ProblemCURDTableController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Problem CURD Table'
        }
      });
  }
}());
