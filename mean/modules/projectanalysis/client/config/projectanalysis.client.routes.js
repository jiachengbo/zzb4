(function () {
  'use strict';

  angular
    .module('projectAnalysis.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('projectAnalysis', {
        abstract: true,
        url: '/projectAnalysis',
        template: '<ui-view/>'
      })
      .state('projectAnalysis.curd', {
        url: '/curd',
        templateUrl: '/modules/projectanalysis/client/views/projectanalysis-curdtable.client.view.html',
        controller: 'ProjectAnalysisCURDTableController',
        controllerAs: 'vm',
        data: {
          pageTitle: '项目管理'
        }
      });
  }
}());
